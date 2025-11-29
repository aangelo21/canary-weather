import Alert from '../models/alert.js';
import Location from '../models/location.js';
import { parseStringPromise, processors } from 'xml2js';

const METEOALARM_FEED_URL = 'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain';

// Keywords to identify Canary Islands areas
const CANARY_KEYWORDS = [
    'Lanzarote', 
    'Fuerteventura', 
    'Gran Canaria', 
    'Tenerife', 
    'La Gomera', 
    'La Palma', 
    'El Hierro',
    'Canarias' // General fallback
];

// Keywords to exclude (to avoid false positives like "Palma de Mallorca" if we just matched "Palma")
const EXCLUDE_KEYWORDS = [
    'Mallorca',
    'Menorca',
    'Ibiza',
    'Formentera',
    'Baleares'
];

/**
 * Fetches and parses weather warnings from the Meteoalarm Atom feed.
 * 
 * Retrieves the XML feed, parses it, and filters entries to find relevant warnings
 * for the Canary Islands.
 * 
 * Filtering criteria:
 * 1. Geographic: Must match Canary Islands keywords and not match exclusion keywords.
 * 2. Severity: Must be 'Severe' (Orange) or 'Extreme' (Red).
 * 
 * @returns {Promise<Array<Object>>} A list of parsed alert objects containing phenomenon, level, timing, and area.
 * @throws {Error} If the fetch fails or parsing errors occur.
 */
export const fetchWarnings = async () => {
    console.log("Fetching warnings from Meteoalarm...");
    try {
        const response = await fetch(METEOALARM_FEED_URL);
        if (!response.ok) {
            throw new Error(`Meteoalarm API error: ${response.status}`);
        }
        const xmlData = await response.text();

        const result = await parseStringPromise(xmlData, {
            explicitArray: false,
            tagNameProcessors: [processors.stripPrefix],
            ignoreAttrs: true
        });

        if (!result.feed || !result.feed.entry) {
            console.log("No entries found in Meteoalarm feed.");
            return [];
        }

        let entries = result.feed.entry;
        if (!Array.isArray(entries)) {
            entries = [entries];
        }

        const alerts = [];

        for (const entry of entries) {
            const areaDesc = entry.areaDesc;
            const severity = entry.severity; // Moderate, Severe, Extreme
            const event = entry.event;
            const onset = entry.onset;
            const expires = entry.expires;

            // Filter for Canary Islands
            const isCanary = CANARY_KEYWORDS.some(keyword => areaDesc.includes(keyword));
            const isExcluded = EXCLUDE_KEYWORDS.some(keyword => areaDesc.includes(keyword));

            if (!isCanary || isExcluded) {
                continue;
            }

            // Filter for Severity (Orange/Red equivalent)
            // Meteoalarm severities: Moderate (Yellow), Severe (Orange), Extreme (Red)
            // User requested "avisos naranjas o rojos" (Orange or Red)
            if (severity !== 'Severe' && severity !== 'Extreme') {
                continue;
            }

            alerts.push({
                phenomenon: event,
                level: severity, // 'Severe' or 'Extreme'
                onset: onset,
                expires: expires,
                area_name: areaDesc
            });
        }

        console.log(`Found ${alerts.length} active alerts for Canary Islands.`);
        return alerts;

    } catch (error) {
        console.error("Error fetching/parsing Meteoalarm data:", error);
        throw error;
    }
};

/**
 * Stores parsed warnings in the database.
 * 
 * Checks for existing alerts to avoid duplicates based on phenomenon, timing, and area.
 * Associates alerts with a default location (e.g., 'Canary Islands') or a fallback.
 * 
 * @param {Array<Object>} warnings - The list of warning objects to store.
 * @returns {Promise<void>}
 */
export const storeWarnings = async (warnings) => {
    try {
        // Find a default location to link alerts to (e.g., "Canary Islands")
        let location = await Location.findOne({ where: { name: 'Canary Islands' } });
        if (!location) {
            // Fallback to any location if specific one doesn't exist, just to store the alert
            location = await Location.findOne();
        }
        
        if (!location) {
            console.error("No location found in DB to link alerts.");
            return;
        }

        for (const warning of warnings) {
            // Check for duplicates
            const existing = await Alert.findOne({
                where: {
                    phenomenon: warning.phenomenon,
                    start_date: new Date(warning.onset),
                    end_date: new Date(warning.expires),
                    area_name: warning.area_name
                }
            });

            if (!existing) {
                await Alert.create({
                    phenomenon: warning.phenomenon,
                    level: warning.level,
                    start_date: new Date(warning.onset),
                    end_date: new Date(warning.expires),
                    area_name: warning.area_name,
                    location_id: location.id
                });
                console.log(`Stored alert: ${warning.phenomenon} in ${warning.area_name}`);
            }
        }
    } catch (error) {
        console.error("Error storing warnings:", error);
        throw error;
    }
};

/**
 * Orchestrates the fetching and storing of weather warnings.
 * 
 * Calls `fetchWarnings` to get data from the external API and then `storeWarnings`
 * to save it to the database.
 * 
 * @returns {Promise<void>}
 */
export const fetchAndStoreWarnings = async () => {
    const warnings = await fetchWarnings();
    await storeWarnings(warnings);
};

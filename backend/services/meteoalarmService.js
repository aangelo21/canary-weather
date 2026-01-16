import Alert from '../models/alert.js';
import Location from '../models/location.js';
import { parseStringPromise, processors } from 'xml2js';

const METEOALARM_FEED_URL =
    'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain';


const CANARY_KEYWORDS = [
    'Lanzarote',
    'Fuerteventura',
    'Gran Canaria',
    'Tenerife',
    'La Gomera',
    'La Palma',
    'El Hierro',
    'Canarias', 
];


const EXCLUDE_KEYWORDS = [
    'Mallorca',
    'Menorca',
    'Ibiza',
    'Formentera',
    'Baleares',
];


export const fetchWarnings = async () => {
    try {
        const response = await fetch(METEOALARM_FEED_URL);
        if (!response.ok) {
            throw new Error(`Meteoalarm API error: ${response.status}`);
        }
        const xmlData = await response.text();

        const result = await parseStringPromise(xmlData, {
            explicitArray: false,
            tagNameProcessors: [processors.stripPrefix],
            ignoreAttrs: true,
        });

        if (!result.feed || !result.feed.entry) {
            return [];
        }

        let entries = result.feed.entry;
        if (!Array.isArray(entries)) {
            entries = [entries];
        }

        const alerts = [];

        for (const entry of entries) {
            const areaDesc = entry.areaDesc;
            const severity = entry.severity; 
            const event = entry.event;
            const onset = entry.onset;
            const expires = entry.expires;

            
            const isCanary = CANARY_KEYWORDS.some((keyword) =>
                areaDesc.includes(keyword),
            );
            const isExcluded = EXCLUDE_KEYWORDS.some((keyword) =>
                areaDesc.includes(keyword),
            );

            if (!isCanary || isExcluded) {
                continue;
            }

            
            
            
            if (
                severity !== 'Moderate' &&
                severity !== 'Severe' &&
                severity !== 'Extreme'
            ) {
                continue;
            }

            alerts.push({
                phenomenon: event,
                level: severity, 
                onset: onset,
                expires: expires,
                area_name: areaDesc,
            });
        }

        return alerts;
    } catch (error) {
        console.error('Error fetching/parsing Meteoalarm data:', error);
        throw error;
    }
};


export const storeWarningsAndGetNew = async (warnings) => {
    const newAlerts = [];

    try {
        
        let location = await Location.findOne({
            where: { name: 'Canary Islands' },
        });
        if (!location) {
            
            location = await Location.findOne();
        }

        if (!location) {
            console.error('No location found in DB to link alerts.');
            return newAlerts;
        }

        for (const warning of warnings) {
            
            const existing = await Alert.findOne({
                where: {
                    phenomenon: warning.phenomenon,
                    start_date: new Date(warning.onset),
                    end_date: new Date(warning.expires),
                    area_name: warning.area_name,
                },
            });

            if (!existing) {
                const newAlert = await Alert.create({
                    phenomenon: warning.phenomenon,
                    level: warning.level,
                    start_date: new Date(warning.onset),
                    end_date: new Date(warning.expires),
                    area_name: warning.area_name,
                    location_id: location.id,
                });
                console.log(
                    `Stored alert: ${warning.phenomenon} in ${warning.area_name}`,
                );
                newAlerts.push(newAlert);
            }
        }
        return newAlerts;
    } catch (error) {
        console.error('Error storing warnings:', error);
        throw error;
    }
};


export const notifyUsersAboutAlerts = async (newAlerts) => {
    if (newAlerts.length === 0) return;

    try {
        const { sendPushNotificationToAll } =
            await import('./pushNotificationService.js');

        
        const hasExtreme = newAlerts.some((alert) => alert.level === 'Extreme');
        const hasSevere = newAlerts.some((alert) => alert.level === 'Severe');

        
        const severityEmoji = hasExtreme ? '🔴' : hasSevere ? '🟠' : '🟡';
        const severityText = hasExtreme
            ? 'Extremas'
            : hasSevere
              ? 'Severas'
              : 'Moderadas';
        const count = newAlerts.length;
        const title =
            count === 1
                ? `${severityEmoji} Nueva Alerta Meteorológica`
                : `${severityEmoji} ${count} Nuevas Alertas ${severityText}`;

        
        const alertsList = newAlerts
            .map((alert) => {
                const emoji =
                    alert.level === 'Extreme'
                        ? '🔴'
                        : alert.level === 'Severe'
                          ? '🟠'
                          : '🟡';
                return `${emoji} ${alert.phenomenon} - ${alert.area_name}`;
            })
            .join('\n');

        await sendPushNotificationToAll({
            title,
            body: alertsList,
            icon: '/logo.webp',
            badge: '/logo.webp',
            data: {
                url: '/warnings',
                count: count,
            },
        });

        console.log(`Sent notification for ${count} new alert(s)`);
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};


export const fetchAndStoreWarnings = async () => {
    const warnings = await fetchWarnings();
    const newAlerts = await storeWarningsAndGetNew(warnings);

    if (newAlerts.length > 0) {
        await notifyUsersAboutAlerts(newAlerts);
    }

    return newAlerts;
};

// Service for interacting with AEMET API
import Alert from '../models/alert.js';
import Location from '../models/location.js';

const AEMET_API_BASE = 'https://opendata.aemet.es/opendata';
const API_KEY = process.env.AEMET_API_KEY; // Set in .env

// Function to fetch latest warnings for Canary Islands
export const fetchWarnings = async () => {
  if (!globalThis.fetch) {
      throw new Error("Fetch API is not available. Please use Node.js 18+ or install node-fetch.");
  }
  if (!API_KEY) {
      console.error("AEMET_API_KEY is missing in environment variables.");
      throw new Error("AEMET API Key missing");
  }
  try {
    console.log("Fetching warnings from AEMET...");
    const area = '65'; // Canary Islands
    // Revert to CAP endpoint as the JSON one does not exist
    const url = `${AEMET_API_BASE}/api/avisos_cap/ultimoelaborado/area/${area}/?api_key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error(`AEMET API error ${response.status}: ${text}`);
      throw new Error(`AEMET API error: ${response.status} - ${text}`);
    }
    
    const data = await response.json();
    if (data.estado === 401 || data.estado === 404 || data.estado === 500) {
         console.error(`AEMET API returned logical error: ${JSON.stringify(data)}`);
         throw new Error(`AEMET API Error: ${data.descripcion}`);
    }

    // data.datos is the URL to the actual data
    const warningsUrl = data.datos;
    if (!warningsUrl) {
        console.warn("No warnings URL found in response:", data);
        return [];
    }

    const warningsResponse = await fetch(warningsUrl, {
      headers: { 'User-Agent': 'CanaryWeatherApp/1.0' }
    });
    if (!warningsResponse.ok) {
       throw new Error(`AEMET data error: ${warningsResponse.status}`);
    }
    
    // The data is likely in CAP (XML) format, not JSON.
    // We need to parse it manually since we don't have an XML parser library installed.
    const text = await warningsResponse.text();
    
    const alerts = [];
    // Regex to find <info> blocks
    const infoRegex = /<info>([\s\S]*?)<\/info>/g;
    let match;
    
    while ((match = infoRegex.exec(text)) !== null) {
        const infoContent = match[1];
        
        // Extract fields
        const eventMatch = /<event>([\s\S]*?)<\/event>/.exec(infoContent);
        const severityMatch = /<severity>([\s\S]*?)<\/severity>/.exec(infoContent);
        const onsetMatch = /<onset>([\s\S]*?)<\/onset>/.exec(infoContent);
        const expiresMatch = /<expires>([\s\S]*?)<\/expires>/.exec(infoContent);
        
        if (eventMatch && onsetMatch && expiresMatch) {
            alerts.push({
                phenomenon: eventMatch[1],
                level: severityMatch ? severityMatch[1] : 'Unknown',
                onset: onsetMatch[1],
                expires: expiresMatch[1]
            });
        }
    }
    
    console.log(`Parsed ${alerts.length} alerts from AEMET CAP data.`);
    return alerts;

  } catch (error) {
    console.error('Error fetching warnings:', error);
    throw error;
  }
};

// Function to store warnings in DB
export const storeWarnings = async (warnings) => {
  try {
    // Find Canary Islands location or create a default one if needed
    // For now, we assume 'Canary Islands' exists as per previous code, 
    // but we should be safe.
    let canaryLocation = await Location.findOne({ where: { name: 'Canary Islands' } });
    
    if (!canaryLocation) {
       // Fallback: try to find any location or create a generic one
       // But user said "no seeders", so we hope it exists. 
       // If not, we can't link it.
       console.warn('Canary Islands location not found. Using first available location or skipping.');
       canaryLocation = await Location.findOne();
       if (!canaryLocation) {
           console.error('No locations found in DB. Cannot store warnings.');
           return;
       }
    }
    const locationId = canaryLocation.id;

    if (!Array.isArray(warnings)) {
        console.error('Warnings is not an array:', warnings);
        return;
    }

    for (const warning of warnings) {
      try {
          // Map fields safely
          const phenomenon = warning.phenomenon || warning.fenomeno || 'Unknown';
          const level = warning.level || warning.nivel || 'Unknown';
          const onset = warning.onset || warning.comienzo;
          const expires = warning.expires || warning.finalizacion;

          if (!onset || !expires) {
              console.warn('Skipping warning without dates:', warning);
              continue;
          }

          // Check if alert already exists
          const existing = await Alert.findOne({
            where: {
              phenomenon: phenomenon,
              start_date: new Date(onset),
              end_date: new Date(expires),
              location_id: locationId
            }
          });
          
          if (!existing) {
            await Alert.create({
              level: level,
              phenomenon: phenomenon,
              start_date: new Date(onset),
              end_date: new Date(expires),
              location_id: locationId
            });
            console.log('Created alert for', phenomenon);
          }
      } catch (innerError) {
          console.error('Error processing single warning:', innerError, warning);
      }
    }
  } catch (error) {
    console.error('Error storing warnings:', error);
    throw error;
  }
};

// Function to fetch and store warnings
export const fetchAndStoreWarnings = async () => {
  const warnings = await fetchWarnings();
  await storeWarnings(warnings);
};

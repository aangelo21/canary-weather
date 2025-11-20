// Service for interacting with AEMET API
import Alert from '../models/alert.js';
import Location from '../models/location.js';

const AEMET_API_BASE = 'https://opendata.aemet.es/opendata';
const API_KEY = process.env.AEMET_API_KEY; // Set in .env

// Function to fetch latest warnings for Canary Islands
export const fetchWarnings = async () => {
  try {
    const area = '65'; // Canary Islands
    const url = `${AEMET_API_BASE}/api/avisos_cap/ultimoelaborado/area/${area}/?api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`AEMET API error: ${response.status}`);
    }
    const data = await response.json();
    // data.datos is the URL to the actual data
    const warningsUrl = data.datos;
    const warningsResponse = await fetch(warningsUrl);
    const warningsData = await warningsResponse.json();
    return warningsData;
  } catch (error) {
    console.error('Error fetching warnings:', error);
    throw error;
  }
};

// Function to store warnings in DB
export const storeWarnings = async (warnings) => {
  try {
    // Find Canary Islands location
    const canaryLocation = await Location.findOne({ where: { name: 'Canary Islands' } });
    if (!canaryLocation) {
      throw new Error('Canary Islands location not found');
    }
    const locationId = canaryLocation.id;

    for (const warning of warnings) {
      // Check if alert already exists by some unique field, e.g., id or phenomenon + dates
      const existing = await Alert.findOne({
        where: {
          phenomenon: warning.phenomenon,
          start_date: new Date(warning.onset),
          end_date: new Date(warning.expires),
          location_id: locationId
        }
      });
      if (!existing) {
        await Alert.create({
          level: warning.level,
          phenomenon: warning.phenomenon,
          start_date: new Date(warning.onset),
          end_date: new Date(warning.expires),
          location_id: locationId
        });
        console.log('Created alert for', warning.phenomenon);
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
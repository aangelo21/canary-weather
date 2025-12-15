import sequelize from '../controllers/dbController.js';
import Location from '../models/location.js';
import PointOfInterest from '../models/pointOfInterest.js';

async function seed() {
    console.log('Starting POI from Locations seeder...');
    await sequelize.sync();

    try {
        const locations = await Location.findAll();
        console.log(`Found ${locations.length} locations.`);

        for (const location of locations) {
            const poiName = `Municipio: ${location.name}`;

            const [poi, created] = await PointOfInterest.findOrCreate({
                where: { name: poiName },
                defaults: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    description: `Municipio de ${location.name}. Información meteorológica y puntos de interés locales.`,
                    is_global: false,
                    type: 'local',
                },
            });

            if (created) {
                console.log(`Created POI: ${poiName}`);
            } else {
                // Update existing POI to ensure it matches location data and is local
                await poi.update({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    description: `Municipio de ${location.name}. Información meteorológica y puntos de interés locales.`,
                    is_global: false,
                    type: 'local',
                });
                console.log(`Updated POI: ${poiName}`);
            }
        }
        console.log('POI from Locations seeder completed.');
    } catch (error) {
        console.error('Error seeding POIs from locations:', error);
    }
}

seed();

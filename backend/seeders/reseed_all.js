import { sequelize, PointOfInterest, Forecast, Alert, Location } from '../models/index.js';

const cleanAndSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Clean Tables
    console.log('Cleaning tables...');
    await Forecast.destroy({ where: {}, truncate: false }); // Truncate might fail with FKs
    await PointOfInterest.destroy({ where: {}, truncate: false });
    // We keep Locations and Alerts for now, or we can clean them too if needed.
    // Let's assume Locations are fine or we can re-seed them if we want.
    
    console.log('Tables cleaned.');

    // 2. Seed POIs (Manually importing the logic from seed_pois_canarias.js to ensure it runs here)
    const poisData = [
      { name: "Teide National Park", latitude: 28.2724, longitude: -16.6425, description: "Tenerife's iconic volcano.", type: 'global' },
      { name: "Maspalomas Dunes", latitude: 27.7419, longitude: -15.5891, description: "Sand dunes in Gran Canaria.", type: 'global' },
      { name: "Timanfaya National Park", latitude: 29.003, longitude: -13.6216, description: "Volcanic landscape in Lanzarote.", type: 'global' },
      { name: "Corralejo Dunes", latitude: 28.7381, longitude: -13.8687, description: "Dunes in Fuerteventura.", type: 'global' },
      { name: "Garajonay National Park", latitude: 28.1263, longitude: -17.2372, description: "Laurel forest in La Gomera.", type: 'global' },
      { name: "Roque de los Muchachos", latitude: 28.7636, longitude: -17.8947, description: "Highest point in La Palma.", type: 'global' },
      { name: "Valle Gran Rey", latitude: 28.1024, longitude: -17.3421, description: "Valley in La Gomera.", type: 'global' },
      { name: "Las Canteras Beach", latitude: 28.1411, longitude: -15.4345, description: "Famous beach in Las Palmas de Gran Canaria.", type: 'global' },
      { name: "Playa de Papagayo", latitude: 28.8433, longitude: -13.7875, description: "Beach in Lanzarote.", type: 'global' },
      { name: "Jandia", latitude: 28.0769, longitude: -14.3619, description: "Peninsula in Fuerteventura.", type: 'global' },
      { name: "Santa Cruz de Tenerife", latitude: 28.4636, longitude: -16.2518, description: "Capital city of Tenerife.", type: 'global' },
      { name: "San Cristobal de La Laguna", latitude: 28.4853, longitude: -16.3167, description: "Historic city in Tenerife.", type: 'global' }
    ];

    const createdPois = await PointOfInterest.bulkCreate(poisData);
    console.log(`Seeded ${createdPois.length} POIs.`);

    // 3. Seed Forecasts
    const forecasts = [];
    const conditions = ['Sunny ☀️', 'Cloudy ☁️', 'Partly Cloudy ⛅', 'Rainy 🌧️', 'Windy 💨'];

    for (const poi of createdPois) {
        // Create a realistic forecast
        const temp = Math.floor(Math.random() * (28 - 18) + 18); // 18-28°C
        const wind = Math.floor(Math.random() * 30 + 5);
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        forecasts.push({
          poi_id: poi.id,
          temperature: temp,
          condition: condition,
          humidity: 60,
          wind_speed: wind,
          air_pressure: 1015,
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }

    await Forecast.bulkCreate(forecasts);
    console.log(`Seeded ${forecasts.length} forecasts.`);

  } catch (error) {
    console.error('Error during re-seeding:', error);
  } finally {
    await sequelize.close();
  }
};

cleanAndSeed();

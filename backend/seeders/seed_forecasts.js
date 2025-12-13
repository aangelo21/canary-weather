import { Forecast, PointOfInterest } from '../models/index.js';
import { sequelize } from '../models/index.js';

const seedForecasts = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const pois = await PointOfInterest.findAll();
    if (pois.length === 0) {
      console.log('No POIs found. Please seed POIs first.');
      return;
    }

    const forecasts = [];
    const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Windy'];

    for (const poi of pois) {
      // Generate 3 forecasts per POI (current, +1h, +2h)
      for (let i = 0; i < 3; i++) {
        forecasts.push({
          poi_id: poi.id,
          temperature: Math.floor(Math.random() * (30 - 15) + 15), // 15-30°C
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity: Math.floor(Math.random() * 100),
          wind_speed: Math.floor(Math.random() * 40),
          air_pressure: 1013 + Math.floor(Math.random() * 20 - 10),
          createdAt: new Date(Date.now() - i * 3600000), // Past timestamps
          updatedAt: new Date()
        });
      }
    }

    await Forecast.bulkCreate(forecasts);
    console.log(`Seeded ${forecasts.length} forecasts.`);

  } catch (error) {
    console.error('Error seeding forecasts:', error);
  } finally {
    await sequelize.close();
  }
};

seedForecasts();

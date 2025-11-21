import sequelize from "../controllers/dbController.js";
import PointOfInterest from "../models/pointOfInterest.js";

async function seed() {
  console.log("Starting POI seeder for Canarias...");

  await sequelize.sync();

  const pois = [
    {
      name: "Parque Nacional del Teide",
      latitude: 28.2724,
      longitude: -16.6425,
    },
    {
      name: "Los Gigantes (Acantilados)",
      latitude: 28.2458,
      longitude: -16.8448,
    },
    {
      name: "Playa de Las Teresitas",
      latitude: 28.5209,
      longitude: -16.2336,
    },
    {
      name: "Roque Nublo",
      latitude: 27.9871,
      longitude: -15.6302,
    },
    {
      name: "Maspalomas Dunes",
      latitude: 27.7419,
      longitude: -15.5891,
    },
    {
      name: "Vegueta (Las Palmas)",
      latitude: 28.1235,
      longitude: -15.43,
    },
    {
      name: "Parque Nacional de Timanfaya",
      latitude: 29.003,
      longitude: -13.6216,
    },
    {
      name: "Playas de Papagayo",
      latitude: 28.8211,
      longitude: -13.8499,
    },
    {
      name: "Dunas de Corralejo",
      latitude: 28.7373,
      longitude: -13.8751,
    },
    {
      name: "Playa de Cofete",
      latitude: 28.2313,
      longitude: -14.3606,
    },
    {
      name: "Caldera de Taburiente",
      latitude: 28.693,
      longitude: -17.8398,
    },
    {
      name: "Parque Nacional de Garajonay",
      latitude: 28.0907,
      longitude: -17.2349,
    },
    {
      name: "Mirador de Abrante",
      latitude: 28.1009,
      longitude: -17.1449,
    },
    {
      name: "Mirador de La Peña",
      latitude: 27.7281,
      longitude: -17.9636,
    },
    {
      name: "Playa de Las Conchas",
      latitude: 29.1692,
      longitude: -13.4244,
    },
  ];

  for (const p of pois) {
    const defaults = {
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      is_global: true,
      type: 'global',
    };

    await PointOfInterest.findOrCreate({
      where: { name: p.name },
      defaults,
    });
  }

  console.log("POI seeding completed for Canarias.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

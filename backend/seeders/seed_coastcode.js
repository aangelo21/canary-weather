import sequelize from "../controllers/dbController.js";
import CoastCode from "../models/coastCode.js";

async function seed() {
  console.log("Starting CoastCode seeder...");

  await sequelize.sync();

  const coastCodes = [
    {
      code: "TFN",
      name: "Tenerife Norte",
      description: "Costa norte de Tenerife",
    },
    {
      code: "TFS",
      name: "Tenerife Sur",
      description: "Costa sur de Tenerife",
    },
    {
      code: "LPA",
      name: "Gran Canaria",
      description: "Costa de Gran Canaria",
    },
    {
      code: "ACE",
      name: "Lanzarote",
      description: "Costa de Lanzarote",
    },
    {
      code: "FUE",
      name: "Fuerteventura",
      description: "Costa de Fuerteventura",
    },
    {
      code: "SPC",
      name: "La Palma",
      description: "Costa de La Palma",
    },
    {
      code: "GMZ",
      name: "La Gomera",
      description: "Costa de La Gomera",
    },
    {
      code: "VDE",
      name: "El Hierro",
      description: "Costa de El Hierro",
    },
  ];

  for (const coastCodeData of coastCodes) {
    try {
      const [coastCode, created] = await CoastCode.findOrCreate({
        where: { code: coastCodeData.code },
        defaults: coastCodeData,
      });

      if (created) {
        console.log(`Created coast code: ${coastCode.code} - ${coastCode.name}`);
      } else {
        console.log(`Coast code already exists: ${coastCode.code} - ${coastCode.name}`);
      }
    } catch (error) {
      console.error(`Error creating coast code ${coastCodeData.code}:`, error.message);
    }
  }

  console.log("CoastCode seeding completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

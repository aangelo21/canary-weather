import sequelize from "../controllers/dbController.js";
import Tide from "../models/tide.js";
import Location from "../models/location.js";

// Seeder for Tide table. Idempotent: uses findOrCreate.
async function seed() {
  console.log("Starting Tide seeder...");

  await sequelize.sync();

  const location = await Location.findOne();
  if (!location) {
    console.log("No location found; run seed_locations.js first.");
    process.exit(0);
  }

  const now = new Date();
  const tides = [
    { timestamp: now, height: 1.2, location_id: location.id },
    {
      timestamp: new Date(now.getTime() + 1000 * 60 * 60 * 6),
      height: 0.3,
      location_id: location.id,
    },
  ];

  for (const t of tides) {
    try {
      const [instance, created] = await Tide.findOrCreate({
        where: { timestamp: t.timestamp, location_id: t.location_id },
        defaults: t,
      });

      if (created) console.log(`Created tide at ${instance.timestamp}`);
      else console.log(`Tide exists at ${instance.timestamp}`);
    } catch (err) {
      console.error(`Error creating tide ${t.timestamp}:`, err.message);
    }
  }

  console.log("Tide seeding completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

import sequelize from "../controllers/dbController.js";
import Alert from "../models/alert.js";
import Location from "../models/location.js";

// Seeder for Alert (warnings). Idempotent: uses findOrCreate.
async function seed() {
  console.log("Starting Alert seeder...");

  await sequelize.sync();

  const location = await Location.findOne();
  if (!location) {
    console.log("No location found; run seed_locations.js first.");
    process.exit(0);
  }

  const alerts = [
    {
      level: "medium",
      phenomenon: "strong winds",
      start_date: new Date(),
      end_date: new Date(Date.now() + 1000 * 60 * 60 * 6),
      location_id: location.id,
    },
  ];

  for (const a of alerts) {
    try {
      const [instance, created] = await Alert.findOrCreate({
        where: {
          phenomenon: a.phenomenon,
          location_id: a.location_id,
          start_date: a.start_date,
        },
        defaults: a,
      });

      if (created) console.log(`Created alert: ${instance.phenomenon}`);
      else console.log(`Alert exists: ${instance.phenomenon}`);
    } catch (err) {
      console.error(`Error creating alert ${a.phenomenon}:`, err.message);
    }
  }

  console.log("Alert seeding completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

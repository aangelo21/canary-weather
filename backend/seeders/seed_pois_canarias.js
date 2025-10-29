import sequelize from "../controllers/dbController.js";
import Location from "../models/location.js";
import PointOfInterest from "../models/pointOfInterest.js";

async function seed() {
    console.log("Starting POI seeder for Canarias...");

    // ensure models are loaded and DB is ready
    await sequelize.sync();

    // Canonical list of Canary Islands (centroid coords approximated)
    const islands = [
        { key: "Tenerife", name: "Tenerife", latitude: 28.2916, longitude: -16.6291 },
        { key: "Gran Canaria", name: "Gran Canaria", latitude: 28.0996, longitude: -15.4135 },
        { key: "Lanzarote", name: "Lanzarote", latitude: 29.0469, longitude: -13.58997 },
        { key: "Fuerteventura", name: "Fuerteventura", latitude: 28.3587, longitude: -14.0537 },
        { key: "La Palma", name: "La Palma", latitude: 28.6570, longitude: -17.8036 },
        { key: "La Gomera", name: "La Gomera", latitude: 28.0964, longitude: -17.1117 },
        { key: "El Hierro", name: "El Hierro", latitude: 27.7026, longitude: -17.9360 },
        { key: "La Graciosa", name: "La Graciosa", latitude: 29.1646, longitude: -13.4445 },
    ];

    const locationMap = {};
    for (const isl of islands) {
        const [loc] = await Location.findOrCreate({
            where: { name: isl.name },
            defaults: {
                name: isl.name,
                latitude: isl.latitude,
                longitude: isl.longitude,
                is_coastal: true,
            },
        });
        locationMap[isl.key] = loc;
    }

    // Points of interest limited to the Canary Islands
    const pois = [
        // Tenerife
        {
            name: "Parque Nacional del Teide",
            latitude: 28.2724,
            longitude: -16.6425,
            description: "Parque nacional alrededor del volcán Teide. Paisajes volcánicos y miradores.",
            locationName: "Tenerife",
        },
        {
            name: "Los Gigantes (Acantilados)",
            latitude: 28.2458,
            longitude: -16.8448,
            description: "Imponentes acantilados en la costa oeste de Tenerife.",
            locationName: "Tenerife",
        },
        { name: "Playa de Las Teresitas", latitude: 28.5209, longitude: -16.2336, description: "Playa de arena dorada en el norte de Tenerife.", locationName: "Tenerife" },

        // Gran Canaria
        { name: "Roque Nublo", latitude: 27.9871, longitude: -15.6302, description: "Formación rocosa emblemática y senderismo.", locationName: "Gran Canaria" },
        { name: "Maspalomas Dunes", latitude: 27.7419, longitude: -15.5891, description: "Dunas costeras protegidas y faro de Maspalomas.", locationName: "Gran Canaria" },
        { name: "Vegueta (Las Palmas)", latitude: 28.1235, longitude: -15.4300, description: "Casco histórico de Las Palmas de Gran Canaria.", locationName: "Gran Canaria" },

        // Lanzarote
        { name: "Parque Nacional de Timanfaya", latitude: 29.0030, longitude: -13.6216, description: "Paisajes volcánicos en Lanzarote.", locationName: "Lanzarote" },
        { name: "Playas de Papagayo", latitude: 28.8211, longitude: -13.8499, description: "Conjunto de playas muy apreciadas por su claridad y arena.", locationName: "Lanzarote" },

        // Fuerteventura
        { name: "Dunas de Corralejo", latitude: 28.7373, longitude: -13.8751, description: "Gran sistema dunar y parque natural.", locationName: "Fuerteventura" },
        { name: "Playa de Cofete", latitude: 28.2313, longitude: -14.3606, description: "Playa salvaje en la costa oeste de Jandía.", locationName: "Fuerteventura" },

        // La Palma
        { name: "Caldera de Taburiente", latitude: 28.6930, longitude: -17.8398, description: "Parque nacional con impresionantes barrancos y bosques.", locationName: "La Palma" },

        // La Gomera
        { name: "Parque Nacional de Garajonay", latitude: 28.0907, longitude: -17.2349, description: "Bosque de laurisilva y miradores.", locationName: "La Gomera" },
        { name: "Mirador de Abrante", latitude: 28.1009, longitude: -17.1449, description: "Mirador con vistas sobre valle de Agulo.", locationName: "La Gomera" },

        // El Hierro
        { name: "Mirador de La Peña", latitude: 27.7281, longitude: -17.9636, description: "Mirador diseñado por César Manrique con vistas al mar.", locationName: "El Hierro" },

        // La Graciosa
        { name: "Playa de Las Conchas", latitude: 29.1692, longitude: -13.4244, description: "Playa emblemática de La Graciosa.", locationName: "La Graciosa" },
    ];

    for (const p of pois) {
        const loc = locationMap[p.locationName];
        const defaults = {
            name: p.name,
            latitude: p.latitude,
            longitude: p.longitude,
            description: p.description,
            is_global: false,
            location_id: loc ? loc.id : null,
        };

        await PointOfInterest.findOrCreate({ where: { name: p.name }, defaults });
    }

    console.log("POI seeding completed for Canarias.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});

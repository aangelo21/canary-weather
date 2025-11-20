import sequelize from "../controllers/dbController.js";
import Location from "../models/location.js";
import PointOfInterest from "../models/pointOfInterest.js";

async function seed() {
  console.log("Starting POI seeder for Canarias...");

  await sequelize.sync();

  const municipios = [
    // Tenerife
    { name: "Santa Cruz de Tenerife", latitude: 28.4636, longitude: -16.2518, is_coastal: true },
    { name: "San Cristóbal de La Laguna", latitude: 28.4853, longitude: -16.3201, is_coastal: true },
    { name: "Adeje", latitude: 28.1227, longitude: -16.726, is_coastal: true },
    { name: "Arona", latitude: 28.0996, longitude: -16.681, is_coastal: true },
    { name: "Puerto de la Cruz", latitude: 28.4144, longitude: -16.5488, is_coastal: true },
    { name: "Los Realejos", latitude: 28.3825, longitude: -16.5847, is_coastal: true },

    // Gran Canaria
    { name: "Las Palmas de Gran Canaria", latitude: 28.1235, longitude: -15.4363, is_coastal: true },
    { name: "Telde", latitude: 27.9924, longitude: -15.4192, is_coastal: true },
    { name: "Santa Lucía de Tirajana", latitude: 27.9117, longitude: -15.5371, is_coastal: true },
    { name: "San Bartolomé de Tirajana", latitude: 27.9248, longitude: -15.5733, is_coastal: true },
    { name: "Mogán", latitude: 27.8836, longitude: -15.7254, is_coastal: true },
    { name: "Arucas", latitude: 28.1198, longitude: -15.5244, is_coastal: false },

    // Lanzarote
    { name: "Arrecife", latitude: 28.963, longitude: -13.5477, is_coastal: true },
    { name: "Tías", latitude: 28.9611, longitude: -13.6937, is_coastal: true },
    { name: "San Bartolomé", latitude: 29.0006, longitude: -13.6129, is_coastal: true },
    { name: "Teguise", latitude: 29.0605, longitude: -13.564, is_coastal: true },
    { name: "Yaiza", latitude: 28.956, longitude: -13.7654, is_coastal: true },

    // Fuerteventura
    { name: "Puerto del Rosario", latitude: 28.5004, longitude: -13.8627, is_coastal: true },
    { name: "Tuineje", latitude: 28.3239, longitude: -14.0474, is_coastal: true },
    { name: "Pájara", latitude: 28.3507, longitude: -14.1077, is_coastal: true },
    { name: "Betancuria", latitude: 28.426, longitude: -14.0541, is_coastal: false },
    { name: "La Oliva", latitude: 28.6135, longitude: -13.9291, is_coastal: true },

    // La Palma
    { name: "Santa Cruz de la Palma", latitude: 28.6839, longitude: -17.7642, is_coastal: true },
    { name: "Los Llanos de Aridane", latitude: 28.6585, longitude: -17.9182, is_coastal: true },
    { name: "El Paso", latitude: 28.6544, longitude: -17.8828, is_coastal: false },
    { name: "Breña Alta", latitude: 28.6468, longitude: -17.7768, is_coastal: true },
    { name: "Villa de Mazo", latitude: 28.609, longitude: -17.7792, is_coastal: true },

    // La Gomera
    { name: "San Sebastián de la Gomera", latitude: 28.0916, longitude: -17.1133, is_coastal: true },
    { name: "Hermigua", latitude: 28.162, longitude: -17.192, is_coastal: true },
    { name: "Agulo", latitude: 28.1868, longitude: -17.1967, is_coastal: true },
    { name: "Vallehermoso", latitude: 28.179, longitude: -17.2647, is_coastal: true },
    { name: "Alajeró", latitude: 28.0603, longitude: -17.2354, is_coastal: true },

    // El Hierro
    { name: "Valverde", latitude: 27.8063, longitude: -17.9158, is_coastal: true },
    { name: "La Frontera", latitude: 27.7546, longitude: -18.0034, is_coastal: true },
    { name: "El Pinar de El Hierro", latitude: 27.7076, longitude: -17.9869, is_coastal: true },

    // La Graciosa
    { name: "Caleta de Sebo", latitude: 29.2311, longitude: -13.5039, is_coastal: true },
  ];

  const locationMap = {};
  for (const municipio of municipios) {
    const [loc] = await Location.findOrCreate({
      where: { name: municipio.name },
      defaults: {
        name: municipio.name,
        latitude: municipio.latitude,
        longitude: municipio.longitude,
        is_coastal: municipio.is_coastal,
      },
    });
    locationMap[municipio.name] = loc;
  }

  const pois = [
    {
      name: "Parque Nacional del Teide",
      latitude: 28.2724,
      longitude: -16.6425,
      description: "Parque nacional alrededor del volcán Teide. Paisajes volcánicos y miradores.",
      locationName: "Adeje",
    },
    {
      name: "Los Gigantes (Acantilados)",
      latitude: 28.2458,
      longitude: -16.8448,
      description: "Imponentes acantilados en la costa oeste de Tenerife.",
      locationName: "Los Realejos",
    },
    {
      name: "Playa de Las Teresitas",
      latitude: 28.5209,
      longitude: -16.2336,
      description: "Playa de arena dorada en el norte de Tenerife.",
      locationName: "Santa Cruz de Tenerife",
    },
    {
      name: "Roque Nublo",
      latitude: 27.9871,
      longitude: -15.6302,
      description: "Formación rocosa emblemática y senderismo.",
      locationName: "Arucas",
    },
    {
      name: "Maspalomas Dunes",
      latitude: 27.7419,
      longitude: -15.5891,
      description: "Dunas costeras protegidas y faro de Maspalomas.",
      locationName: "San Bartolomé de Tirajana",
    },
    {
      name: "Vegueta (Las Palmas)",
      latitude: 28.1235,
      longitude: -15.43,
      description: "Casco histórico de Las Palmas de Gran Canaria.",
      locationName: "Las Palmas de Gran Canaria",
    },
    {
      name: "Parque Nacional de Timanfaya",
      latitude: 29.003,
      longitude: -13.6216,
      description: "Paisajes volcánicos en Lanzarote.",
      locationName: "Yaiza",
    },
    {
      name: "Playas de Papagayo",
      latitude: 28.8211,
      longitude: -13.8499,
      description: "Conjunto de playas muy apreciadas por su claridad y arena.",
      locationName: "Yaiza",
    },
    {
      name: "Dunas de Corralejo",
      latitude: 28.7373,
      longitude: -13.8751,
      description: "Gran sistema dunar y parque natural.",
      locationName: "La Oliva",
    },
    {
      name: "Playa de Cofete",
      latitude: 28.2313,
      longitude: -14.3606,
      description: "Playa salvaje en la costa oeste de Jandía.",
      locationName: "Pájara",
    },
    {
      name: "Caldera de Taburiente",
      latitude: 28.693,
      longitude: -17.8398,
      description: "Parque nacional con impresionantes barrancos y bosques.",
      locationName: "El Paso",
    },
    {
      name: "Parque Nacional de Garajonay",
      latitude: 28.0907,
      longitude: -17.2349,
      description: "Bosque de laurisilva y miradores.",
      locationName: "Agulo",
    },
    {
      name: "Mirador de Abrante",
      latitude: 28.1009,
      longitude: -17.1449,
      description: "Mirador con vistas sobre valle de Agulo.",
      locationName: "Agulo",
    },
    {
      name: "Mirador de La Peña",
      latitude: 27.7281,
      longitude: -17.9636,
      description: "Mirador diseñado por César Manrique con vistas al mar.",
      locationName: "La Frontera",
    },
    {
      name: "Playa de Las Conchas",
      latitude: 29.1692,
      longitude: -13.4244,
      description: "Playa emblemática de La Graciosa.",
      locationName: "Caleta de Sebo",
    },
  ];

  for (const p of pois) {
    const loc = locationMap[p.locationName];
    const defaults = {
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      description: p.description,
      is_global: true,
      type: 'global',
      location_id: loc ? loc.id : null,
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

import sequelize from '../controllers/dbController.js';
import PointOfInterest from '../models/pointOfInterest.js';

async function seed() {
    console.log('Starting POI seeder for Canarias...');

    await sequelize.sync();

    const pois = [
        {
            name: 'Parque Nacional del Teide',
            latitude: 28.2724,
            longitude: -16.6425,
            description:
                'Parque volcánico y símbolo natural de Tenerife, con impresionantes paisajes y rutas de senderismo.',
        },
        {
            name: 'Los Gigantes (Acantilados)',
            latitude: 28.2458,
            longitude: -16.8448,
            description:
                'Acantilados espectaculares en la costa oeste de Tenerife, conocidos por sus vistas al mar.',
        },
        {
            name: 'Playa de Las Teresitas',
            latitude: 28.5209,
            longitude: -16.2336,
            description:
                'Playa de arena dorada cerca de Santa Cruz de Tenerife, ideal para familias y baño seguro.',
        },
        {
            name: 'Roque Nublo',
            latitude: 27.9871,
            longitude: -15.6302,
            description:
                'Formación rocosa emblemática en Gran Canaria, popular entre senderistas y fotógrafos.',
        },
        {
            name: 'Maspalomas Dunes',
            latitude: 27.7419,
            longitude: -15.5891,
            description:
                'Extensa lengua de dunas costeras en el sur de Gran Canaria, con ecosistema protegido.',
        },
        {
            name: 'Vegueta (Las Palmas)',
            latitude: 28.1235,
            longitude: -15.43,
            description:
                'Casco histórico de Las Palmas de Gran Canaria con arquitectura tradicional y plazas.',
        },
        {
            name: 'Parque Nacional de Timanfaya',
            latitude: 29.003,
            longitude: -13.6216,
            description:
                'Paisaje volcánico único en Lanzarote con rutas guiadas y vistas lunares.',
        },
        {
            name: 'Playas de Papagayo',
            latitude: 28.8211,
            longitude: -13.8499,
            description:
                'Conjunto de calas de aguas turquesas en el sur de Lanzarote, muy valoradas por su belleza.',
        },
        {
            name: 'Dunas de Corralejo',
            latitude: 28.7373,
            longitude: -13.8751,
            description:
                'Paraje de dunas y playas en Fuerteventura con paisajes naturales y actividades acuáticas.',
        },
        {
            name: 'Playa de Cofete',
            latitude: 28.2313,
            longitude: -14.3606,
            description:
                'Playa salvaje y extensa en la península de Jandía (Fuerteventura), de gran belleza natural.',
        },
        {
            name: 'Caldera de Taburiente',
            latitude: 28.693,
            longitude: -17.8398,
            description:
                'Gran caldera volcánica en La Palma con rutas de montaña y miradores.',
        },
        {
            name: 'Parque Nacional de Garajonay',
            latitude: 28.0907,
            longitude: -17.2349,
            description:
                'Bosques de laurisilva en La Gomera, Patrimonio de la Humanidad, con senderos frondosos.',
        },
        {
            name: 'Mirador de Abrante',
            latitude: 28.1009,
            longitude: -17.1449,
            description:
                'Mirador panorámico en La Gomera con vistas espectaculares al valle de Agulo.',
        },
        {
            name: 'Mirador de La Peña',
            latitude: 27.7281,
            longitude: -17.9636,
            description:
                'Mirador y centro cultural en El Hierro diseñado por César Manrique, con vistas al mar.',
        },
        {
            name: 'Playa de Las Conchas',
            latitude: 29.1692,
            longitude: -13.4244,
            description:
                'Playa de arena dorada en La Graciosa, accesible por barco desde Lanzarote.',
        },
    ];

    for (const p of pois) {
        const defaults = {
            name: p.name,
            latitude: p.latitude,
            longitude: p.longitude,
            description: p.description || null,
            is_global: true,
            type: 'global',
        };

        const [poi, created] = await PointOfInterest.findOrCreate({
            where: { name: p.name },
            defaults,
        });

        if (!created) {
            // ensure description and flags are up to date
            await poi.update({
                latitude: p.latitude,
                longitude: p.longitude,
                description: p.description || null,
                is_global: true,
                type: 'global',
            });
        }
    }

    console.log('POI seeding completed for Canarias.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});

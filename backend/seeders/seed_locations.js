import sequelize from '../controllers/dbController.js';
import Location from '../models/location.js';

async function seed() {
    console.log('Starting Location seeder...');
    await sequelize.sync();
    const locations = [
        {
            aemet_code: '35001',
            name: 'Agaete',
            latitude: 28.1049,
            longitude: -15.7037,
        },
        {
            aemet_code: '35002',
            name: 'Agüimes',
            latitude: 27.9056,
            longitude: -15.4459,
        },
        {
            aemet_code: '35020',
            name: 'Aldea de San Nicolás, La',
            latitude: 27.9889,
            longitude: -15.7914,
        },
        {
            aemet_code: '35005',
            name: 'Artenara',
            latitude: 28.0144,
            longitude: -15.6519,
        },
        {
            aemet_code: '35006',
            name: 'Arucas',
            latitude: 28.1199,
            longitude: -15.5252,
        },
        {
            aemet_code: '35008',
            name: 'Firgas',
            latitude: 28.1394,
            longitude: -15.5497,
        },
        {
            aemet_code: '35009',
            name: 'Gáldar',
            latitude: 28.1469,
            longitude: -15.6503,
        },
        {
            aemet_code: '35011',
            name: 'Ingenio',
            latitude: 27.9208,
            longitude: -15.4389,
        },
        {
            aemet_code: '35012',
            name: 'Mogán',
            latitude: 27.8761,
            longitude: -15.7881,
        },
        {
            aemet_code: '35013',
            name: 'Moya',
            latitude: 28.1089,
            longitude: -15.5889,
        },
        {
            aemet_code: '35016',
            name: 'Palmas de Gran Canaria, Las',
            latitude: 28.1239,
            longitude: -15.4363,
        },
        {
            aemet_code: '35019',
            name: 'San Bartolomé de Tirajana',
            latitude: 27.9227,
            longitude: -15.5733,
        },
        {
            aemet_code: '35021',
            name: 'Santa Brígida',
            latitude: 28.0256,
            longitude: -15.5014,
        },
        {
            aemet_code: '35022',
            name: 'Santa Lucía de Tirajana',
            latitude: 27.9128,
            longitude: -15.5422,
        },
        {
            aemet_code: '35023',
            name: 'Santa María de Guía de Gran Canaria',
            latitude: 28.1308,
            longitude: -15.6261,
        },
        {
            aemet_code: '35025',
            name: 'Tejeda',
            latitude: 27.9981,
            longitude: -15.6089,
        },
        {
            aemet_code: '35026',
            name: 'Telde',
            latitude: 27.9922,
            longitude: -15.4192,
        },
        {
            aemet_code: '35027',
            name: 'Teror',
            latitude: 28.0583,
            longitude: -15.5456,
        },
        {
            aemet_code: '35032',
            name: 'Valleseco',
            latitude: 28.0583,
            longitude: -15.5844,
        },
        {
            aemet_code: '35031',
            name: 'Valsequillo de Gran Canaria',
            latitude: 27.9836,
            longitude: -15.4942,
        },
        {
            aemet_code: '35033',
            name: 'Vega de San Mateo',
            latitude: 28.0072,
            longitude: -15.5056,
        },
        {
            aemet_code: '35004',
            name: 'Arrecife',
            latitude: 28.963,
            longitude: -13.5477,
        },
        {
            aemet_code: '35010',
            name: 'Haría',
            latitude: 29.1478,
            longitude: -13.5008,
        },
        {
            aemet_code: '35018',
            name: 'San Bartolomé',
            latitude: 29.0033,
            longitude: -13.6061,
        },
        {
            aemet_code: '35024',
            name: 'Teguise',
            latitude: 29.0603,
            longitude: -13.5639,
        },
        {
            aemet_code: '35028',
            name: 'Tías',
            latitude: 28.9611,
            longitude: -13.6558,
        },
        {
            aemet_code: '35029',
            name: 'Tinajo',
            latitude: 29.0639,
            longitude: -13.6919,
        },
        {
            aemet_code: '35034',
            name: 'Yaiza',
            latitude: 28.9544,
            longitude: -13.7639,
        },
        {
            aemet_code: '35003',
            name: 'Antigua',
            latitude: 28.4178,
            longitude: -14.015,
        },
        {
            aemet_code: '35007',
            name: 'Betancuria',
            latitude: 28.4272,
            longitude: -14.0631,
        },
        {
            aemet_code: '35014',
            name: 'Oliva, La',
            latitude: 28.6156,
            longitude: -13.9278,
        },
        {
            aemet_code: '35015',
            name: 'Pájara',
            latitude: 28.3506,
            longitude: -14.1056,
        },
        {
            aemet_code: '35017',
            name: 'Puerto del Rosario',
            latitude: 28.5,
            longitude: -13.8667,
        },
        {
            aemet_code: '35030',
            name: 'Tuineje',
            latitude: 28.3528,
            longitude: -14.0442,
        },
        {
            aemet_code: '38001',
            name: 'Adeje',
            latitude: 28.1231,
            longitude: -16.7264,
        },
        {
            aemet_code: '38004',
            name: 'Arafo',
            latitude: 28.3378,
            longitude: -16.4156,
        },
        {
            aemet_code: '38005',
            name: 'Arico',
            latitude: 28.1681,
            longitude: -16.4736,
        },
        {
            aemet_code: '38006',
            name: 'Arona',
            latitude: 28.0997,
            longitude: -16.6811,
        },
        {
            aemet_code: '38010',
            name: 'Buenavista del Norte',
            latitude: 28.3711,
            longitude: -16.8622,
        },
        {
            aemet_code: '38011',
            name: 'Candelaria',
            latitude: 28.3547,
            longitude: -16.3728,
        },
        {
            aemet_code: '38012',
            name: 'Fasnia',
            latitude: 28.2297,
            longitude: -16.4417,
        },
        {
            aemet_code: '38015',
            name: 'Garachico',
            latitude: 28.3736,
            longitude: -16.7622,
        },
        {
            aemet_code: '38016',
            name: 'Granadilla de Abona',
            latitude: 28.1178,
            longitude: -16.5736,
        },
        {
            aemet_code: '38017',
            name: 'Guancha, La',
            latitude: 28.3678,
            longitude: -16.6261,
        },
        {
            aemet_code: '38018',
            name: 'Guía de Isora',
            latitude: 28.2133,
            longitude: -16.7806,
        },
        {
            aemet_code: '38019',
            name: 'Güímar',
            latitude: 28.3119,
            longitude: -16.4111,
        },
        {
            aemet_code: '38020',
            name: 'Icod de los Vinos',
            latitude: 28.3686,
            longitude: -16.7133,
        },
        {
            aemet_code: '38021',
            name: 'Matanza de Acentejo, La',
            latitude: 28.4453,
            longitude: -16.465,
        },
        {
            aemet_code: '38022',
            name: 'Orotava, La',
            latitude: 28.39,
            longitude: -16.5253,
        },
        {
            aemet_code: '38028',
            name: 'Puerto de la Cruz',
            latitude: 28.4136,
            longitude: -16.5489,
        },
        {
            aemet_code: '38031',
            name: 'Realejos, Los',
            latitude: 28.38,
            longitude: -16.5669,
        },
        {
            aemet_code: '38032',
            name: 'Rosario, El',
            latitude: 28.455,
            longitude: -16.3303,
        },
        {
            aemet_code: '38023',
            name: 'San Cristóbal de La Laguna',
            latitude: 28.4853,
            longitude: -16.3158,
        },
        {
            aemet_code: '38034',
            name: 'San Juan de la Rambla',
            latitude: 28.3822,
            longitude: -16.6339,
        },
        {
            aemet_code: '38035',
            name: 'San Miguel de Abona',
            latitude: 28.0928,
            longitude: -16.6181,
        },
        {
            aemet_code: '38038',
            name: 'Santa Cruz de Tenerife',
            latitude: 28.4636,
            longitude: -16.2518,
        },
        {
            aemet_code: '38039',
            name: 'Santa Úrsula',
            latitude: 28.4222,
            longitude: -16.49,
        },
        {
            aemet_code: '38040',
            name: 'Santiago del Teide',
            latitude: 28.3075,
            longitude: -16.8089,
        },
        {
            aemet_code: '38041',
            name: 'Sauzal, El',
            latitude: 28.4731,
            longitude: -16.4414,
        },
        {
            aemet_code: '38042',
            name: 'Silos, Los',
            latitude: 28.3714,
            longitude: -16.7969,
        },
        {
            aemet_code: '38043',
            name: 'Tacoronte',
            latitude: 28.4761,
            longitude: -16.4092,
        },
        {
            aemet_code: '38044',
            name: 'Tanque, El',
            latitude: 28.3408,
            longitude: -16.7847,
        },
        {
            aemet_code: '38046',
            name: 'Tegueste',
            latitude: 28.5236,
            longitude: -16.3364,
        },
        {
            aemet_code: '38051',
            name: 'Victoria de Acentejo, La',
            latitude: 28.4211,
            longitude: -16.4817,
        },
        {
            aemet_code: '38052',
            name: 'Vilaflor de Chasna',
            latitude: 28.1583,
            longitude: -16.6342,
        },
        {
            aemet_code: '38007',
            name: 'Barlovento',
            latitude: 28.8261,
            longitude: -17.8053,
        },
        {
            aemet_code: '38008',
            name: 'Breña Alta',
            latitude: 28.6572,
            longitude: -17.8639,
        },
        {
            aemet_code: '38009',
            name: 'Breña Baja',
            latitude: 28.6261,
            longitude: -17.8864,
        },
        {
            aemet_code: '38014',
            name: 'Fuencaliente de la Palma',
            latitude: 28.4972,
            longitude: -17.8481,
        },
        {
            aemet_code: '38024',
            name: 'Garafía',
            latitude: 28.8278,
            longitude: -17.9289,
        },
        {
            aemet_code: '38025',
            name: 'Llanos de Aridane, Los',
            latitude: 28.6592,
            longitude: -17.9172,
        },
        {
            aemet_code: '38027',
            name: 'Paso, El',
            latitude: 28.6436,
            longitude: -17.8736,
        },
        {
            aemet_code: '38029',
            name: 'Puntagorda',
            latitude: 28.7961,
            longitude: -17.9631,
        },
        {
            aemet_code: '38030',
            name: 'Puntallana',
            latitude: 28.7444,
            longitude: -17.7856,
        },
        {
            aemet_code: '38033',
            name: 'San Andrés y Sauces',
            latitude: 28.7767,
            longitude: -17.7764,
        },
        {
            aemet_code: '38037',
            name: 'Santa Cruz de la Palma',
            latitude: 28.6833,
            longitude: -17.7667,
        },
        {
            aemet_code: '38045',
            name: 'Tazacorte',
            latitude: 28.6369,
            longitude: -17.9353,
        },
        {
            aemet_code: '38047',
            name: 'Tijarafe',
            latitude: 28.7281,
            longitude: -17.9339,
        },
        {
            aemet_code: '38053',
            name: 'Villa de Mazo',
            latitude: 28.605,
            longitude: -17.7847,
        },
        {
            aemet_code: '38002',
            name: 'Agulo',
            latitude: 28.1889,
            longitude: -17.2097,
        },
        {
            aemet_code: '38003',
            name: 'Alajeró',
            latitude: 28.0681,
            longitude: -17.2372,
        },
        {
            aemet_code: '38026',
            name: 'Hermigua',
            latitude: 28.1817,
            longitude: -17.1639,
        },
        {
            aemet_code: '38036',
            name: 'San Sebastián de la Gomera',
            latitude: 28.0916,
            longitude: -17.1133,
        },
        {
            aemet_code: '38049',
            name: 'Valle Gran Rey',
            latitude: 28.0939,
            longitude: -17.3197,
        },
        {
            aemet_code: '38050',
            name: 'Vallehermoso',
            latitude: 28.18,
            longitude: -17.2619,
        },
        {
            aemet_code: '38013',
            name: 'Frontera',
            latitude: 27.7522,
            longitude: -18.0008,
        },
        {
            aemet_code: '38901',
            name: 'Pinar de El Hierro, El',
            latitude: 27.7867,
            longitude: -17.9944,
        },
        {
            aemet_code: '38048',
            name: 'Valverde',
            latitude: 27.8111,
            longitude: -17.9158,
        },
        {
            name: 'Canary Islands',
            latitude: 28.0,
            longitude: -15.5,
        },
    ];
    for (const loc of locations) {
        try {
            const [instance, created] = await Location.findOrCreate({
                where: { name: loc.name },
                defaults: loc,
            });
            if (created) console.log(`Created location: ${instance.name}`);
            else console.log(`Location exists: ${instance.name}`);
        } catch (err) {
            console.error(`Error creating location ${loc.name}:`, err.message);
        }
    }
    console.log('Location seeding completed!');
    process.exit(0);
}
seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});

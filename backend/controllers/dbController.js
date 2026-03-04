
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const DB_HOST = process.env.DB_HOST || process.env.DB_URL;
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'canaryweather';
const DB_USER = process.env.DB_USERNAME || process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;

let dialectOptions = {};
if (process.env.DB_SSL === 'true') {
    dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectOptions,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
        freezeTableName: true,
    },
    pool: {
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        min: parseInt(process.env.DB_POOL_MIN || '0', 10),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10),
    },
});

sequelize
    .authenticate()
    .then(() => {})
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

export default sequelize;

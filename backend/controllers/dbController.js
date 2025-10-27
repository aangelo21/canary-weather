// imports dependencies
import { Sequelize } from "sequelize";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

config();

// creates .env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_HOST = process.env.DB_HOST || process.env.DB_URL;
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE;
const DB_USER = process.env.DB_USERNAME || process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const defaultCaPath = path.resolve(
    __dirname,
    "../certificates/ca-certificate.crt"
);
const CA_PATH = process.env.DB_SSL_CA || defaultCaPath;

let dialectOptions = {};
try {
    if (fs.existsSync(CA_PATH)) {
        dialectOptions = {
            ssl: {
                ca: fs.readFileSync(CA_PATH, "utf8"),
            },
        };
    }
} catch (err) {
    console.warn(
        `Warning: Unable to read SSL CA file at ${CA_PATH}. Proceeding without explicit CA.`
    );
}

// initializes Sequelize with .env variables
const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: process.env.DB_DIALECT || "mysql",
        dialectOptions,
        logging: process.env.DB_LOGGING === "true" ? console.log : false,
        define: {
            freezeTableName: true,
        },
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || "10", 10),
            min: parseInt(process.env.DB_POOL_MIN || "0", 10),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
            idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
        },
    }
);

// tests the database connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error);
    });

export default sequelize;

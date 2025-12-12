// Import Sequelize ORM and utilities
import { Sequelize } from "sequelize";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Database Controller (Configuration)
 * 
 * This module initializes the Sequelize instance for connecting to the MySQL database.
 * It handles environment variable loading, SSL configuration for secure connections (e.g., Azure MySQL),
 * and exports the configured Sequelize instance for use in models and other controllers.
 */

// Load environment variables from .env file
config();

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract database configuration from environment variables with fallbacks
const DB_HOST = process.env.DB_HOST || process.env.DB_URL;
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE;
const DB_USER = process.env.DB_USERNAME || process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;

// Default path to SSL CA certificate
const defaultCaPath = path.resolve(
  __dirname,
  "../certificates/ca-certificate.crt"
);
const CA_PATH = process.env.DB_SSL_CA || defaultCaPath;

// Initialize dialect options for SSL configuration
let dialectOptions = {};
try {
  // Check if SSL CA file exists and read it for secure connections
  if (fs.existsSync(CA_PATH)) {
    dialectOptions = {
      ssl: {
        ca: fs.readFileSync(CA_PATH, "utf8"),
      },
    };
  }
} catch (err) {
  // Warn if SSL CA file cannot be read, proceed without explicit CA
  console.warn(
    `Warning: Unable to read SSL CA file at ${CA_PATH}. Proceeding without explicit CA.`
  );

}

// Create Sequelize instance with database configuration
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: process.env.DB_DIALECT || "mysql",
  dialectOptions,
  // Enable logging based on environment variable
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  define: {
    // Prevent Sequelize from pluralizing table names
    freezeTableName: true,
  },
  pool: {
    // Connection pool settings for performance
    max: parseInt(process.env.DB_POOL_MAX || "10", 10),
    min: parseInt(process.env.DB_POOL_MIN || "0", 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
    idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
  },
});

// Test database connection on initialization
sequelize
  .authenticate()
  .then(() => {
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Export the Sequelize instance for use in models and controllers
export default sequelize;

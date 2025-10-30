const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || process.env.DB_URL || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'database';
const DB_USER = process.env.DB_USERNAME || process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || null;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  test: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
};

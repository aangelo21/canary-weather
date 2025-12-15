// Import Sequelize instance for model definition
import sequelize from '../controllers/dbController.js';
// Import DataTypes for defining column types
import { DataTypes } from 'sequelize';

/**
 * Location Model
 *
 * Represents a geographical location, typically a municipality or island in the Canary Islands.
 * Used as a reference for Alerts and User preferences.
 *
 * @typedef {Object} Location
 * @property {string} id - Unique identifier (UUID).
 * @property {string} aemet_code - Code used by AEMET (Spanish Met Office) for this location.
 * @property {string} name - Name of the location (e.g., 'Santa Cruz de Tenerife').
 * @property {number} latitude - Geographical latitude.
 * @property {number} longitude - Geographical longitude.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const Location = sequelize.define(
    'Location',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        aemet_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    },
);

// Export the Location model for use in other parts of the application
export default Location;

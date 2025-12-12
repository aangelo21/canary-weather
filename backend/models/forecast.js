// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

/**
 * Forecast Model
 * 
 * Represents a weather forecast entry for a specific Point of Interest.
 * Stores meteorological data such as temperature, condition, humidity, etc.
 * 
 * @typedef {Object} Forecast
 * @property {string} id - Unique identifier (UUID).
 * @property {number} temperature - Temperature value.
 * @property {string} condition - Textual description of weather condition (e.g., 'Sunny').
 * @property {number} humidity - Humidity percentage.
 * @property {number} air_pressure - Atmospheric pressure.
 * @property {number} wind_speed - Wind speed.
 * @property {string} poi_id - Foreign key referencing the PointOfInterest.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const Forecast = sequelize.define(
  "Forecast",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    temperature: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    air_pressure: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wind_speed: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    poi_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// Export the Forecast model for use in other parts of the application
export default Forecast;

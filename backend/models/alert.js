// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

/**
 * Alert Model
 * 
 * Represents a weather alert or warning.
 * Stores information about the severity, phenomenon type, and duration of the alert.
 * Linked to a specific Location.
 * 
 * @typedef {Object} Alert
 * @property {string} id - Unique identifier (UUID).
 * @property {string} level - Severity level (e.g., 'Yellow', 'Orange', 'Red').
 * @property {string} phenomenon - Type of weather event (e.g., 'Wind', 'Rain').
 * @property {Date} start_date - Start time of the alert.
 * @property {Date} end_date - End time of the alert.
 * @property {string} location_id - Foreign key referencing the Location.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const Alert = sequelize.define(
  "Alert",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phenomenon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    area_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

// Export the Alert model for use in other parts of the application
export default Alert;

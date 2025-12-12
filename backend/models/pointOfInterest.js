// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

/**
 * PointOfInterest Model
 * 
 * Represents a specific location of interest.
 * Can be:
 * - 'global': Visible to all users (e.g., major landmarks).
 * - 'local': Associated with a specific municipality/location.
 * - 'personal': Created by a specific user for their own use.
 * 
 * @typedef {Object} PointOfInterest
 * @property {string} id - Unique identifier (UUID).
 * @property {string} name - Name of the POI.
 * @property {string} description - Description of the POI.
 * @property {number} latitude - Geographical latitude.
 * @property {number} longitude - Geographical longitude.
 * @property {boolean} is_global - Deprecated flag (use 'type' instead).
 * @property {string} type - The type of POI ('global', 'local', 'personal').
 * @property {string} image_url - URL to an image of the POI.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const PointOfInterest = sequelize.define(
  "PointOfInterest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    is_global: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.ENUM('global', 'local', 'personal'),
      allowNull: false,
      defaultValue: 'local',
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

// Export the PointOfInterest model for use in other parts of the application
export default PointOfInterest;

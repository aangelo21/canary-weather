// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the Location model representing geographical locations in the Canary Islands
const Location = sequelize.define(
  "Location",
  {
    // Unique identifier for each location, auto-generated UUID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // AEMET code for weather data integration (Spanish Meteorological Agency)
    aemet_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Human-readable name of the location
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Latitude coordinate for mapping
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    // Longitude coordinate for mapping
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    // Boolean flag indicating if the location is coastal (affects tide data availability)
    is_coastal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Foreign key reference to CoastCode for tide information
    coast_code_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    // Enable automatic timestamps (createdAt, updatedAt)
    timestamps: true,
  }
);

// Export the Location model for use in other parts of the application
export default Location;

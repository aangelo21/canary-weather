// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the PointOfInterest model for user-created or predefined points of interest
const PointOfInterest = sequelize.define(
  "PointOfInterest",
  {
    // Unique identifier for each POI, auto-generated UUID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Name of the point of interest
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
    // Optional description of the POI
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Boolean flag indicating if the POI is global (visible to all users) or user-specific
    is_global: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Foreign key reference to Location if the POI is tied to a specific location
    location_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // URL to an image associated with the POI
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  // Enable automatic timestamps (createdAt, updatedAt)
  { timestamps: true }
);

// Export the PointOfInterest model for use in other parts of the application
export default PointOfInterest;

// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the Tide model for storing tide level data
const Tide = sequelize.define(
  "Tide",
  {
    // Unique identifier for each tide entry, auto-generated UUID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Date and time of the tide measurement
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Tide height in meters
    height: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    // Foreign key reference to the associated Location
    location_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // Foreign key reference to CoastCode for tide data source
    coast_code_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  // Enable automatic timestamps (createdAt, updatedAt)
  { timestamps: true }
);

// Export the Tide model for use in other parts of the application
export default Tide;

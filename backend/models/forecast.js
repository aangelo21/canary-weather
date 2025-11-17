// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the Forecast model for storing weather forecast data
const Forecast = sequelize.define(
  "Forecast",
  {
    // Unique identifier for each forecast entry, auto-generated UUID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Temperature value in degrees Celsius
    temperature: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    // Wind information (speed and direction)
    wind: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Probability of rain as a percentage
    rain_probability: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    // Date and time of the forecast
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Foreign key reference to the associated Location
    location_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  // Enable automatic timestamps (createdAt, updatedAt)
  { timestamps: true }
);

// Export the Forecast model for use in other parts of the application
export default Forecast;

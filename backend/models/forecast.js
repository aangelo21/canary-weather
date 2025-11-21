// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the Forecast model for storing weather forecast data
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

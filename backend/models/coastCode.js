// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the CoastCode model for storing coastal area codes used for tide data
const CoastCode = sequelize.define(
    "CoastCode",
    {
        // Unique identifier for each coast code, auto-generated UUID
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // The actual coast code string (e.g., from external tide data sources)
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Human-readable name of the coastal area
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Optional description of the coast code
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    // Enable automatic timestamps (createdAt, updatedAt)
    { timestamps: true }
);

// Export the CoastCode model for use in other parts of the application
export default CoastCode;

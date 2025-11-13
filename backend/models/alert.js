// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the Alert model for storing weather alert information
const Alert = sequelize.define(
    "Alert",
    {
        // Unique identifier for each alert, auto-generated UUID
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // Severity level of the alert (e.g., low, medium, high)
        level: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Description of the weather phenomenon causing the alert
        phenomenon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Start date and time of the alert period
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        // End date and time of the alert period
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
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

// Export the Alert model for use in other parts of the application
export default Alert;

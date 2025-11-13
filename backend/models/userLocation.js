// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the UserLocation junction table for many-to-many relationship between User and Location
// This table tracks which locations are favorited or selected by users
const UserLocation = sequelize.define(
    "UserLocation",
    {
        // Foreign key to User table, part of composite primary key
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        // Foreign key to Location table, part of composite primary key
        location_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        // Timestamp when the user selected/favorited this location
        selected_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    // Disable automatic timestamps since we have selected_at
    { timestamps: false }
);

// Export the UserLocation model for use in other parts of the application
export default UserLocation;

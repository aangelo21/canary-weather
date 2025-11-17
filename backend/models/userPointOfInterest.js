// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the UserPointOfInterest junction table for many-to-many relationship between User and PointOfInterest
// This table tracks which points of interest are favorited by users
const UserPointOfInterest = sequelize.define(
  "UserPointOfInterest",
  {
    // Foreign key to User table, part of composite primary key
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    // Foreign key to PointOfInterest table, part of composite primary key
    point_of_interest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    // Timestamp when the user favorited this point of interest
    favorited_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  // Disable automatic timestamps since we have favorited_at
  { timestamps: false }
);

// Export the UserPointOfInterest model for use in other parts of the application
export default UserPointOfInterest;

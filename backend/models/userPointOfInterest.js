// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the UserPointOfInterest junction table for many-to-many relationship between User and PointOfInterest
// This table tracks which points of interest are favorited by users
const UserPointOfInterest = sequelize.define(
  "UserPointOfInterest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    point_of_interest_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    favorited_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

// Export the UserPointOfInterest model for use in other parts of the application
export default UserPointOfInterest;

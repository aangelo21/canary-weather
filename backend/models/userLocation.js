// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

// Define the UserLocation junction table for many-to-many relationship between User and Location
// This table tracks which locations are favorited or selected by users
const UserLocation = sequelize.define(
  "UserLocation",
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
    location_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    selected_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

// Export the UserLocation model for use in other parts of the application
export default UserLocation;

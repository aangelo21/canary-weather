// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

/**
 * UserLocation Model
 * 
 * Represents the association between a User and a Location.
 * Used to track which location a user has currently selected or favorited.
 * 
 * @typedef {Object} UserLocation
 * @property {string} id - Unique identifier (UUID).
 * @property {string} user_id - Foreign key referencing the User.
 * @property {string} location_id - Foreign key referencing the Location.
 * @property {Date} selected_at - Timestamp when the location was selected.
 */
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

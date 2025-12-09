// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";

/**
 * User Model
 * 
 * Represents a registered user of the application.
 * Handles authentication (password hashing) and profile information.
 * 
 * @typedef {Object} User
 * @property {string} id - Unique identifier (UUID).
 * @property {string} email - User's email address (unique).
 * @property {string} username - User's display name.
 * @property {string} profile_picture_url - URL to profile image.
 * @property {boolean} is_admin - Flag indicating administrative privileges.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const User = sequelize.define(
  "User",
  {
    // Unique identifier for each user, auto-generated UUID
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // User's email address, required for authentication
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Optional username for display purposes
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // URL to the user's profile picture, optional
    profile_picture_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Boolean flag to indicate if the user has administrator privileges
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    // Enable automatic timestamps (createdAt, updatedAt)
    timestamps: true,
  }
);

// Export the User model for use in other parts of the application
export default User;

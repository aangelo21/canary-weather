// Import Sequelize instance for model definition
import sequelize from "../controllers/dbController.js";
// Import DataTypes for defining column types
import { DataTypes } from "sequelize";
// Import bcrypt for password hashing
import bcrypt from "bcrypt";

// Define the User model using Sequelize
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
        // Hashed password for secure authentication
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // URL to the user's profile picture, optional
        profile_picture_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        // Enable automatic timestamps (createdAt, updatedAt)
        timestamps: true,
        // Define hooks to hash passwords before saving
        hooks: {
            // Hash password before creating a new user
            beforeCreate: async (user) => {
                if (user.password) {
                    // Generate salt for hashing
                    const salt = await bcrypt.genSalt(10);
                    // Hash the password with the salt
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            // Hash password before updating if it has changed
            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    // Generate salt for hashing
                    const salt = await bcrypt.genSalt(10);
                    // Hash the password with the salt
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

// Export the User model for use in other parts of the application
export default User;

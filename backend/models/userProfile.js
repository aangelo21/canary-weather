import sequelize from '../controllers/dbController.js';
import { DataTypes } from 'sequelize';

/**
 * UserProfile Model
 *
 * Stores additional user information that is not contained in LDAP,
 * such as the profile picture and bio.
 * Linked to the LDAP user via the 'username' field.
 *
 * @typedef {Object} UserProfile
 * @property {string} username - The LDAP username (Primary Key).
 * @property {string} profile_picture_url - URL to the uploaded profile image.
 * @property {string} bio - User biography or description.
 */
const UserProfile = sequelize.define(
    'UserProfile',
    {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        profile_picture_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'UserProfiles',
        timestamps: true,
    },
);

export default UserProfile;

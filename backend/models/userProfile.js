import sequelize from '../controllers/dbController.js';
import { DataTypes } from 'sequelize';


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

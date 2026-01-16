
import sequelize from '../controllers/dbController.js';

import { DataTypes } from 'sequelize';


const User = sequelize.define(
    'User',
    {
        
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        profile_picture_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        
        ldap_id: {
            type: DataTypes.UUID,
            allowNull: true,
            unique: true,
        },
        
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        
        timestamps: true,
    },
);


export default User;

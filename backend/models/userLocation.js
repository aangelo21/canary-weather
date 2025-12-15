
import sequelize from '../controllers/dbController.js';

import { DataTypes } from 'sequelize';


const UserLocation = sequelize.define(
    'UserLocation',
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
    { timestamps: false },
);


export default UserLocation;

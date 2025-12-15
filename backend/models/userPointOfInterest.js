
import sequelize from '../controllers/dbController.js';

import { DataTypes } from 'sequelize';


const UserPointOfInterest = sequelize.define(
    'UserPointOfInterest',
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
    { timestamps: false },
);


export default UserPointOfInterest;

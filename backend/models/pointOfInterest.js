
import sequelize from '../controllers/dbController.js';

import { DataTypes } from 'sequelize';


const PointOfInterest = sequelize.define(
    'PointOfInterest',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        is_global: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type: {
            type: DataTypes.ENUM('global', 'local', 'personal'),
            allowNull: false,
            defaultValue: 'local',
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    { timestamps: true },
);


export default PointOfInterest;

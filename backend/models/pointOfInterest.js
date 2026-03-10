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
        created_by: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'User',
                key: 'id',
            },
        },
    },
    { timestamps: true },
);

export default PointOfInterest;

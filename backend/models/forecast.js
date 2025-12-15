
import sequelize from '../controllers/dbController.js';

import { DataTypes } from 'sequelize';


const Forecast = sequelize.define(
    'Forecast',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        temperature: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        condition: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        humidity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        air_pressure: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        wind_speed: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        poi_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    { timestamps: true },
);


export default Forecast;

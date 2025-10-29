import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const Forecast = sequelize.define(
    "Forecast",
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
        wind: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rain_probability: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    { timestamps: true }
);

export default Forecast;

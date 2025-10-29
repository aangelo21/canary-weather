import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const Location = sequelize.define(
    "Location",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        aemet_code: {
            type: DataTypes.STRING,
            allowNull: true,
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
        is_coastal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        coast_code_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);

export default Location;

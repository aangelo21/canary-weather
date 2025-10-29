import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const PointOfInterest = sequelize.define(
    "PointOfInterest",
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_global: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        location_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    { timestamps: true }
);

export default PointOfInterest;

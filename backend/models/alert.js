import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const Alert = sequelize.define(
    "Alert",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phenomenon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        location_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    { timestamps: true }
);

export default Alert;

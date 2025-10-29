import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const Tide = sequelize.define(
    "Tide",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        height: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        location_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        coast_code_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    { timestamps: true }
);

export default Tide;

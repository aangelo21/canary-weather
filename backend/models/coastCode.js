import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const CoastCode = sequelize.define(
    "CoastCode",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    { timestamps: true }
);

export default CoastCode;

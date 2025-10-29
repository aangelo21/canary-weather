import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const UserLocation = sequelize.define(
    "UserLocation",
    {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        location_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        selected_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    { timestamps: false }
);

export default UserLocation;

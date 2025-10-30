import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const UserPointOfInterest = sequelize.define(
    "UserPointOfInterest",
    {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        point_of_interest_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        favorited_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    { timestamps: false }
);

export default UserPointOfInterest;

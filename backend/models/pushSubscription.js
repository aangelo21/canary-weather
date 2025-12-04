import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

/**
 * PushSubscription Model
 * 
 * Stores Web Push subscriptions for users.
 * Allows the server to send push notifications to specific browsers/devices.
 */
const PushSubscription = sequelize.define(
  "PushSubscription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING, // Matches User.username (LDAP)
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "PushSubscriptions",
    timestamps: true,
  }
);

export default PushSubscription;

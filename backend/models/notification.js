import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('info', 'warning', 'alert', 'success'),
      allowNull: false,
      defaultValue: 'info',
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    alert_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default Notification;

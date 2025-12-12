import sequelize from "../controllers/dbController.js";
import { DataTypes } from "sequelize";

/**
 * Notification Model
 * 
 * Represents a system notification sent to a user.
 * Can be informational, a warning, an alert, or a success message.
 * Optionally linked to a specific Alert.
 * 
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier (UUID).
 * @property {string} message - The content of the notification.
 * @property {string} type - The type of notification ('info', 'warning', 'alert', 'success').
 * @property {Date} sent_at - Timestamp when the notification was sent.
 * @property {string} user_id - Foreign key referencing the User who receives the notification.
 * @property {string} alert_id - Foreign key referencing an associated Alert (optional).
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
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
  {
    tableName: 'Notifications',
    timestamps: true,
  }
);

export default Notification;

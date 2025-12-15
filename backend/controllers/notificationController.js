import { Notification, User, Alert } from '../models/index.js';

/**
 * Notification Controller
 *
 * Handles the retrieval, creation, and management of user notifications.
 * Notifications are typically generated when alerts match user preferences.
 */

/**
 * Retrieves all notifications.
 *
 * Fetches a list of all notifications in the system, including details about
 * the associated User and Alert. Ordered by sent time (newest first).
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the list of notifications.
 */
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            include: [
                { model: User, attributes: ['id', 'email', 'username'] },
                { model: Alert, attributes: ['id', 'level', 'phenomenon'] },
            ],
            order: [['sent_at', 'DESC']],
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves a specific notification by ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the notification.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the notification or a 404 error.
 */
export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'email', 'username'] },
                { model: Alert, attributes: ['id', 'level', 'phenomenon'] },
            ],
        });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves all notifications for a specific user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the user's notifications.
 */
export const getNotificationsByUser = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.params.userId },
            include: [
                { model: Alert, attributes: ['id', 'level', 'phenomenon'] },
            ],
            order: [['sent_at', 'DESC']],
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Creates a new notification.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The notification data.
 * @param {string} req.body.message - The notification message.
 * @param {string} req.body.type - The type of notification (e.g., 'email', 'push').
 * @param {number} req.body.user_id - The ID of the recipient user.
 * @param {number} [req.body.alert_id] - The ID of the associated alert (optional).
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the created notification.
 */
export const createNotification = async (req, res) => {
    try {
        const { message, type, user_id, alert_id } = req.body;
        const notification = await Notification.create({
            message,
            type,
            user_id,
            alert_id,
            sent_at: new Date(),
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Updates an existing notification.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the notification to update.
 * @param {Object} req.body - The updated data.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the updated notification.
 */
export const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await notification.update(req.body);
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Deletes a notification.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the notification to delete.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} 204 No Content response on success.
 */
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await notification.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

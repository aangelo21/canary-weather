import { Notification, User, Alert } from '../models/index.js';




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

import express from 'express';
import {
    saveSubscription,
    sendPushNotification,
    deleteSubscription,
    checkSubscription,
} from '../services/pushNotificationService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/push/subscribe:
 *   post:
 *     summary: Subscribe to push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription:
 *                 type: object
 *                 description: The push subscription object from the browser
 *     responses:
 *       201:
 *         description: Subscription saved successfully
 */
router.post('/subscribe', authenticateToken, async (req, res) => {
    try {
        const subscription = req.body;
        const userId = req.user.username; 

        await saveSubscription(userId, subscription);
        res.status(201).json({ message: 'Subscription saved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/push/unsubscribe:
 *   post:
 *     summary: Unsubscribe from push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *                 description: The subscription endpoint to remove
 *     responses:
 *       200:
 *         description: Subscription removed successfully
 */
router.post('/unsubscribe', authenticateToken, async (req, res) => {
    try {
        const { endpoint } = req.body;
        const userId = req.user.username;

        await deleteSubscription(userId, endpoint);
        res.json({ message: 'Subscription removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/push/check-subscription:
 *   post:
 *     summary: Check if a subscription exists for the current user
 *     tags: [Push Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 */
router.post('/check-subscription', authenticateToken, async (req, res) => {
    try {
        const { endpoint } = req.body;
        const userId = req.user.username;

        const exists = await checkSubscription(userId, endpoint);
        res.json({ exists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/push/send-test:
 *   post:
 *     summary: Send a test push notification to the current user
 *     tags: [Push Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notification sent
 */
router.post('/send-test', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.username;
        const payload = {
            title: 'Canary Weather',
            body: '¡Gracias por activar las notificaciones! Te avisaremos de las alertas meteorológicas importantes en Canarias.',
            icon: '/logo.webp',
        };

        await sendPushNotification(userId, payload);
        res.json({ message: 'Notification sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/vapid-public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;

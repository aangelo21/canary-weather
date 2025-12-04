import express from "express";
import { saveSubscription, sendPushNotification } from "../services/pushNotificationService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

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
router.post("/subscribe", authenticateToken, async (req, res) => {
  try {
    const subscription = req.body;
    const userId = req.user.username; // Assuming username is the ID

    await saveSubscription(userId, subscription);
    res.status(201).json({ message: "Subscription saved" });
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
router.post("/send-test", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.username;
    const payload = {
      title: "Test Notification",
      body: "This is a test notification from Canary Weather!",
      icon: "/logo.webp",
    };

    await sendPushNotification(userId, payload);
    res.json({ message: "Notification sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint to get the VAPID Public Key
 */
router.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;

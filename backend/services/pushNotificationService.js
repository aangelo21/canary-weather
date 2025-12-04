import webpush from "web-push";
import { PushSubscription } from "../models/index.js";

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Saves a push subscription for a user.
 * 
 * @param {string} userId - The username/ID of the user.
 * @param {Object} subscription - The subscription object from the browser.
 */
export const saveSubscription = async (userId, subscription) => {
  try {
    await PushSubscription.create({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });
  } catch (error) {
    console.error("Error saving subscription:", error);
    throw error;
  }
};

/**
 * Sends a push notification to a specific user.
 * 
 * @param {string} userId - The username/ID of the user.
 * @param {Object} payload - The notification payload (title, body, etc.).
 */
export const sendPushNotification = async (userId, payload) => {
  try {
    // Get all subscriptions for the user
    const subscriptions = await PushSubscription.findAll({
      where: { user_id: userId },
    });

    const notifications = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush
        .sendNotification(pushSubscription, JSON.stringify(payload))
        .catch((err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription is no longer valid, remove it
            console.log(`Subscription expired for user ${userId}, deleting...`);
            return sub.destroy();
          }
          console.error("Error sending push notification:", err);
        });
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error("Error sending push notifications:", error);
    throw error;
  }
};

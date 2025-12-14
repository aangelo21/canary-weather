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
 * Deletes a push subscription for a user.
 * 
 * @param {string} userId - The username/ID of the user.
 * @param {string} endpoint - The subscription endpoint to remove.
 */
export const deleteSubscription = async (userId, endpoint) => {
  try {
    await PushSubscription.destroy({
      where: {
        user_id: userId,
        endpoint: endpoint,
      },
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    throw error;
  }
};

/**
 * Checks if a subscription exists for a user.
 * 
 * @param {string} userId - The username/ID of the user.
 * @param {string} endpoint - The subscription endpoint to check.
 * @returns {Promise<boolean>} True if subscription exists.
 */
export const checkSubscription = async (userId, endpoint) => {
  try {
    const count = await PushSubscription.count({
      where: {
        user_id: userId,
        endpoint: endpoint,
      },
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking subscription:", error);
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

/**
 * Sends a push notification to all subscribed users.
 * 
 * @param {Object} payload - The notification payload (title, body, etc.).
 */
export const sendPushNotificationToAll = async (payload) => {
  try {
    // Get all subscriptions
    const subscriptions = await PushSubscription.findAll();

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
            console.log(`Subscription expired, deleting...`);
            return sub.destroy();
          }
          console.error("Error sending push notification:", err);
        });
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error("Error sending push notifications to all users:", error);
    throw error;
  }
};

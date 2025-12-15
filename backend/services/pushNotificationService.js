import webpush from 'web-push';
import { PushSubscription } from '../models/index.js';


webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
);


export const saveSubscription = async (userId, subscription) => {
    try {
        await PushSubscription.create({
            user_id: userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
        });
    } catch (error) {
        console.error('Error saving subscription:', error);
        throw error;
    }
};


export const deleteSubscription = async (userId, endpoint) => {
    try {
        await PushSubscription.destroy({
            where: {
                user_id: userId,
                endpoint: endpoint,
            },
        });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        throw error;
    }
};


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
        console.error('Error checking subscription:', error);
        throw error;
    }
};


export const sendPushNotification = async (userId, payload) => {
    try {
        
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
                        
                        return sub.destroy();
                    }
                    console.error('Error sending push notification:', err);
                });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error('Error sending push notifications:', error);
        throw error;
    }
};


export const sendPushNotificationToAll = async (payload) => {
    try {
        
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
                        
                        console.log(`Subscription expired, deleting...`);
                        return sub.destroy();
                    }
                    console.error('Error sending push notification:', err);
                });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error('Error sending push notifications to all users:', error);
        throw error;
    }
};

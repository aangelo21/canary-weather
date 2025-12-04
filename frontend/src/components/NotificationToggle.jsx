import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotificationToggle = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        // Check if already subscribed
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.pushManager.getSubscription().then(subscription => {
                    setIsSubscribed(!!subscription);
                });
            });
        }
    }, []);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeUser = async () => {
        setLoading(true);
        try {
            // Ensure SW is registered
            let registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                console.log('No SW found, registering...');
                registration = await navigator.serviceWorker.register('/sw.js');
            }
            
            // Wait for it to be ready
            await navigator.serviceWorker.ready;
            
            // Get VAPID key from backend
            const response = await fetch(`${API_BASE}/push/vapid-public-key`);
            if (!response.ok) {
                throw new Error('Failed to fetch VAPID key');
            }
            const { publicKey } = await response.json();
            if (!publicKey) {
                throw new Error('VAPID key not found');
            }
            console.log('VAPID Key received:', publicKey);
            const convertedVapidKey = urlBase64ToUint8Array(publicKey.trim());

            // Check existing subscription
            let subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                console.log('User already subscribed in browser, updating server...');
            } else {
                console.log('Subscribing user to push manager...');
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });
            }

            // Send subscription to backend
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }

            const subResponse = await fetch(`${API_BASE}/push/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!subResponse.ok) {
                throw new Error('Failed to save subscription on server');
            }

            setIsSubscribed(true);
            
            // Send test notification
            await fetch(`${API_BASE}/push/send-test`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        } catch (error) {
            console.error('Error subscribing:', error);
            alert(`Error enabling notifications: ${error.message}`);
        } finally {

            setLoading(false);
        }
    };

    if (!('serviceWorker' in navigator)) {
        return null;
    }

    return (
        <button
            onClick={subscribeUser}
            disabled={isSubscribed || loading}
            className={`w-full text-left px-5 py-4 text-sm font-medium transition-colors flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700 ${
                isSubscribed 
                    ? 'text-green-600 dark:text-green-400 cursor-default' 
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
            }`}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {loading ? 'Enabling...' : isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
        </button>
    );
};

export default NotificationToggle;

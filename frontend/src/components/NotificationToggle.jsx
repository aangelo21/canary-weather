import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccessToken } from '../services/api';
import Skeleton from './common/Skeleton';

const NotificationToggle = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const { t } = useTranslation();
    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            setChecking(true);
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    
                    const registration =
                        await navigator.serviceWorker.getRegistration();

                    if (!registration) {
                        setIsSubscribed(false);
                        setChecking(false);
                        return;
                    }

                    const subscription =
                        await registration.pushManager.getSubscription();

                    if (subscription) {
                        
                        const token = getAccessToken();
                        if (token) {
                            const response = await fetch(
                                `${API_BASE}/push/check-subscription`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                        endpoint: subscription.endpoint,
                                    }),
                                },
                            );

                            if (response.ok) {
                                const { exists } = await response.json();
                                setIsSubscribed(exists);
                            } else {
                                setIsSubscribed(false);
                            }
                        }
                    } else {
                        setIsSubscribed(false);
                    }
                } catch (error) {
                    console.error('Error checking subscription status:', error);
                    setIsSubscribed(false);
                }
            }
            setChecking(false);
        };

        checkSubscriptionStatus();
    }, [API_BASE]);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
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
            
            let registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                console.log('No SW found, registering...');
                registration = await navigator.serviceWorker.register('/sw.js');
            }

            
            await navigator.serviceWorker.ready;

            
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

            
            let subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                console.log(
                    'User already subscribed in browser, updating server...',
                );
            } else {
                console.log('Subscribing user to push manager...');
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey,
                });
            }

            
            const token = getAccessToken();
            if (!token) {
                throw new Error('User not authenticated');
            }

            const subResponse = await fetch(`${API_BASE}/push/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!subResponse.ok) {
                throw new Error('Failed to save subscription on server');
            }

            setIsSubscribed(true);

            
            await fetch(`${API_BASE}/push/send-test`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error subscribing:', error);
            alert(`Error enabling notifications: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const unsubscribeUser = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription =
                await registration.pushManager.getSubscription();

            if (subscription) {
                
                const token = getAccessToken();
                if (token) {
                    await fetch(`${API_BASE}/push/unsubscribe`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            endpoint: subscription.endpoint,
                        }),
                    });
                }

                
                
                
                
                
                

                
                
                

                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
            alert('Error disabling notifications');
        } finally {
            setLoading(false);
        }
    };

    if (!('serviceWorker' in navigator)) {
        return null;
    }

    if (checking) {
        return (
            <div className="w-full px-5 py-4 border-b border-neutral-100 dark:border-neutral-700 flex items-center gap-3">
                <Skeleton variant="circular" className="w-5 h-5" />
                <Skeleton className="w-32 h-4" />
            </div>
        );
    }

    return (
        <button
            onClick={isSubscribed ? unsubscribeUser : subscribeUser}
            disabled={loading}
            className={`w-full text-left px-5 py-4 text-sm font-medium transition-colors flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700 ${
                isSubscribed
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
            }`}
        >
            {isSubscribed ? (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                </svg>
            ) : (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
            )}
            {loading
                ? isSubscribed
                    ? t('disabling')
                    : t('enabling')
                : isSubscribed
                  ? t('disableNotifications')
                  : t('enableNotifications')}
        </button>
    );
};

export default NotificationToggle;

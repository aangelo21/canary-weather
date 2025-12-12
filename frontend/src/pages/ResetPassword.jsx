import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ResetPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError(t('invalidTokenError'));
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError(t('passwordsDontMatch'));
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const response = await fetch(`${API_BASE}/users/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
                credentials: 'include', // Important for cookies
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(t('passwordResetSuccess'));
                
                // Auto-login if token and user are returned
                if (data.token && data.user) {
                    localStorage.setItem('cw_user', JSON.stringify(data.user));
                    // If your app uses a separate token storage or relies on the cookie set by backend
                    // The backend sets a cookie, so subsequent requests should be authenticated.
                    // However, the frontend might need to know it's logged in immediately.
                    // We can force a reload to home to pick up the session.
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            } else {
                setError(t('resetFailed'));
            }
        } catch (err) {
            setError(t('connectionFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">{t('invalidRequest')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{t('missingToken')}</p>
                    <Link to="/" className="text-brand-primary hover:underline">{t('returnToHome')}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {t('setNewPassword')}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('newPasswordLabel')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                                placeholder={t('newPasswordLabel')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('confirmPassword')}
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                                placeholder={t('confirmPassword')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
                            {message}
                            <p className="mt-2 text-xs">{t('redirectingHome')}</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? t('resetting') : t('resetPasswordButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

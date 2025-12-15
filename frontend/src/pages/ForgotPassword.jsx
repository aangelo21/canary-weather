import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { validateEmail } from '../utils/validation';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setValidationError('');

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setValidationError(emailValidation.error);
            return;
        }

        setIsLoading(true);

        try {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const response = await fetch(`${API_BASE}/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(t('resetLinkSent'));
            } else {
                setError(t('errorOccurred'));
            }
        } catch (err) {
            setError(t('connectionFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (validationError) {
            setValidationError('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Forgot Password"
                description="Reset your Canary Weather account password."
            />
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {t('resetPasswordTitle')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {t('resetPasswordDesc')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                {t('emailAddress')}
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm ${validationError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                                placeholder={t('emailAddress')}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {validationError && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {validationError}
                                </p>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
                            {message}
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
                            {isLoading ? t('sending') : t('sendResetLink')}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/"
                            className="font-medium text-brand-primary hover:text-blue-500"
                        >
                            {t('backToHome')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

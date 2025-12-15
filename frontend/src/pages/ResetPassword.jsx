import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    validatePassword,
    validatePasswordMatch,
    getPasswordStrength,
} from '../utils/validation';

const ResetPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        strength: 'none',
        color: 'gray',
        percentage: 0,
    });

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError(t('invalidTokenError'));
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});

        const errors = {};

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors.join('. ');
        }

        // Validate password match
        const matchValidation = validatePasswordMatch(
            password,
            confirmPassword,
        );
        if (!matchValidation.isValid) {
            errors.confirmPassword = matchValidation.error;
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError(t('pleaseFixErrors') || 'Please fix the errors below');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const response = await fetch(`${API_BASE}/users/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(t('passwordResetSuccess'));

                if (data.token && data.user) {
                    localStorage.setItem('cw_user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            } else {
                const errorMsg = data.error || t('resetFailed');
                if (data.details && Array.isArray(data.details)) {
                    setValidationErrors({ password: data.details.join('. ') });
                }
                setError(errorMsg);
            }
        } catch (err) {
            setError(t('connectionFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        const strength = getPasswordStrength(newPassword);
        setPasswordStrength(strength);

        if (validationErrors.password) {
            setValidationErrors((prev) => {
                const { password, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);

        if (validationErrors.confirmPassword) {
            setValidationErrors((prev) => {
                const { confirmPassword, ...rest } = prev;
                return rest;
            });
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        {t('invalidRequest')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('missingToken')}
                    </p>
                    <Link to="/" className="text-brand-primary hover:underline">
                        {t('returnToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Reset Password"
                description="Create a new password for your Canary Weather account."
            />
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        {t('setNewPassword')}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {t('newPasswordLabel')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm ${validationErrors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                                placeholder="6-20 chars, A-Z, a-z, 0-9, !@#$"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {password &&
                                passwordStrength.strength !== 'none' && (
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${
                                                        passwordStrength.color ===
                                                        'red'
                                                            ? 'bg-red-500'
                                                            : passwordStrength.color ===
                                                                'yellow'
                                                              ? 'bg-yellow-500'
                                                              : 'bg-green-500'
                                                    }`}
                                                    style={{
                                                        width: `${passwordStrength.percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span
                                                className={`text-xs font-medium ${
                                                    passwordStrength.color ===
                                                    'red'
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : passwordStrength.color ===
                                                            'yellow'
                                                          ? 'text-yellow-600 dark:text-yellow-400'
                                                          : 'text-green-600 dark:text-green-400'
                                                }`}
                                            >
                                                {passwordStrength.strength ===
                                                'weak'
                                                    ? t('weak') || 'Weak'
                                                    : passwordStrength.strength ===
                                                        'medium'
                                                      ? t('medium') || 'Medium'
                                                      : t('strong') || 'Strong'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            {validationErrors.password && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {t('confirmPassword')}
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm ${validationErrors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                                placeholder={t('confirmPassword')}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            {validationErrors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {validationErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
                            {message}
                            <p className="mt-2 text-xs">
                                {t('redirectingHome')}
                            </p>
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
                            {isLoading
                                ? t('resetting')
                                : t('resetPasswordButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

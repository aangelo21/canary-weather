import { useState, useEffect, useRef } from 'react';
import {
    createOrUpdateUser,
    loginUser,
    deleteUser,
    fetchMunicipalities,
    getCurrentUser,
} from '../../services/userService';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    validatePassword,
    validateEmail,
    validateUsername,
    validatePasswordMatch,
    getPasswordStrength,
} from '../../utils/validation';

export default function LoginModal({
    isOpen,
    onClose,
    onLogin,
    user,
    onLogout,
}) {
    const { t } = useTranslation();

    const [view, setView] = useState('login');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [input, setInput] = useState({
        emailOrUsername: '',
        password: '',
        username: '',
        email: '',
        confirm: '',
        location_ids: [],
    });
    const [selectedLocationToAdd, setSelectedLocationToAdd] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        strength: 'none',
        color: 'gray',
        percentage: 0,
    });
    const [loading, setLoading] = useState(false);
    const [municipalities, setMunicipalities] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [showEditConfirmPassword, setShowEditConfirmPassword] =
        useState(false);

    const fileInputRef = useRef(null);
    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        if (user && isOpen) {
            setInput({
                email: user.email || '',
                username: user.username || '',
                password: '',
                confirm: '',
                emailOrUsername: '',
                location_ids: user.Locations
                    ? user.Locations.map((l) => String(l.id))
                    : [],
            });

            getCurrentUser()
                .then((freshUser) => {
                    setInput((prev) => ({
                        ...prev,
                        location_ids: freshUser.Locations
                            ? freshUser.Locations.map((l) => String(l.id))
                            : [],
                    }));
                    localStorage.setItem('cw_user', JSON.stringify(freshUser));
                })
                .catch((err) =>
                    console.error('Error refreshing user data:', err),
                );
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchMunicipalities()
                .then(setMunicipalities)
                .catch((err) =>
                    console.error('Error loading municipalities:', err),
                );
        }
    }, [isOpen]);

    const handleImageClick = () => {
        if (user && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const formData = new FormData();
        formData.append('profile_picture', file);

        setUploading(true);
        try {
            const updatedUser = await createOrUpdateUser(formData, user.id);
            const newUser = {
                ...user,
                profile_picture_url: updatedUser.profile_picture_url,
            };
            localStorage.setItem('cw_user', JSON.stringify(newUser));
            onLogin(newUser);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setError(t('errorUploadProfile'));
        } finally {
            setUploading(false);
        }
    };

    const getProfileImageUrl = () => {
        if (user?.profile_picture_url) {
            const baseUrl = API_BASE.replace('/api', '');
            return `${baseUrl}${user.profile_picture_url}`;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});

        if (view === 'signup') {
            const errors = {};
            const emailValidation = validateEmail(input.email);
            if (!emailValidation.isValid) errors.email = emailValidation.error;

            const usernameValidation = validateUsername(input.username);
            if (!usernameValidation.isValid)
                errors.username = usernameValidation.error;

            const passwordValidation = validatePassword(input.password);
            if (!passwordValidation.isValid)
                errors.password = passwordValidation.errors.join('. ');

            const matchValidation = validatePasswordMatch(
                input.password,
                input.confirm,
            );
            if (!matchValidation.isValid)
                errors.confirm = matchValidation.error;

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                setError(t('pleaseFixErrors') || 'Please fix the errors below');
                return;
            }

            setLoading(true);
            try {
                const result = await createOrUpdateUser({
                    email: input.email,
                    username: input.username,
                    password: input.password,
                    location_ids: input.location_ids,
                });
                setLoading(false);
                if (result && result.user) {
                    let loggedUser = result.user;
                    if (loggedUser.id)
                        localStorage.setItem('userId', loggedUser.id);
                    onLogin(loggedUser);
                } else {
                    onLogin(result);
                }
            } catch (err) {
                setLoading(false);
                const errorMsg = err.message || t('errorCreateUser');
                if (errorMsg.includes('email') || errorMsg.includes('Email')) {
                    setValidationErrors({ email: errorMsg });
                } else if (
                    errorMsg.includes('usuario') ||
                    errorMsg.includes('username')
                ) {
                    setValidationErrors({ username: errorMsg });
                }
                setError(errorMsg);
            }
        } else {
            if (!input.emailOrUsername || !input.password) {
                setError(t('allFieldsRequired'));
                return;
            }
            setLoading(true);
            try {
                const result = await loginUser({
                    username: input.emailOrUsername,
                    password: input.password,
                });
                setLoading(false);
                if (result.user) {
                    let loggedUser = result.user;
                    if (loggedUser.id)
                        localStorage.setItem('userId', loggedUser.id);
                    onLogin(loggedUser);
                } else {
                    setError(t('loginFailed'));
                }
            } catch (err) {
                setLoading(false);
                setError(err.message || t('errorSignIn'));
            }
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setInput((prev) => ({ ...prev, password: newPassword }));
        if (view === 'signup' || user) {
            const strength = getPasswordStrength(newPassword);
            setPasswordStrength(strength);
            if (validationErrors.password) {
                setValidationErrors((prev) => {
                    const { password, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const handleInputChange = (field, value) => {
        setInput((prev) => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors((prev) => {
                const { [field]: removed, ...rest } = prev;
                return rest;
            });
        }
    };

    if (!isOpen) return null;

    // Delete Confirmation Modal
    if (showDeleteConfirm) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div
                    className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-sm relative transform transition-all scale-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                            <svg
                                className="h-6 w-6 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                            {t('deleteAccount')}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                            {t('confirmDeleteAccount')}
                        </p>
                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}
                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={loading}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all transform active:scale-95"
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        await deleteUser(user.id);
                                        setLoading(false);
                                        onLogout();
                                        onClose();
                                    } catch (err) {
                                        setLoading(false);
                                        setError(
                                            err.message || t('errorDeleteUser'),
                                        );
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? t('processing') : t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Edit Profile Modal
    if (user) {
        return (
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
                        <div>
                            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {t('editProfile')}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {t('editProfileDesc') ||
                                    'Update your personal information'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-500"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-neutral-800 shadow-xl">
                                    {getProfileImageUrl() ? (
                                        <img
                                            src={getProfileImageUrl()}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
                                            {user.username
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleImageClick}
                                    disabled={uploading}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]"
                                >
                                    <svg
                                        className="w-6 h-6 text-white drop-shadow-md"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={handleImageClick}>
                                {t('changeProfilePic')}
                            </p>
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setError('');
                                setValidationErrors({});
                                // ... (validation logic same as before, simplified for brevity but keeping core checks)
                                const errors = {};
                                if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = t('invalidEmail');
                                if (input.username && !/^[a-zA-Z0-9_]{3,20}$/.test(input.username)) errors.username = t('invalidUsername');
                                if (input.password) {
                                    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/.test(input.password)) errors.password = t('invalidPassword');
                                    if (input.password !== input.confirm) errors.confirm = t('passwordsDontMatch');
                                }
                                if (Object.keys(errors).length > 0) {
                                    setValidationErrors(errors);
                                    return;
                                }

                                setLoading(true);
                                try {
                                    const updateData = {};
                                    if (input.email) updateData.email = input.email;
                                    if (input.username) updateData.username = input.username;
                                    if (input.password) updateData.password = input.password;
                                    if (input.location_ids) updateData.location_ids = input.location_ids;
                                    const result = await createOrUpdateUser(updateData, user.id);
                                    setLoading(false);
                                    if (result) {
                                        onLogin(result);
                                        onClose();
                                    }
                                } catch (err) {
                                    setLoading(false);
                                    setError(err.message || t('errorUpdateUser'));
                                }
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                                        {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        className={`w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.email ? 'border-red-500' : ''}`}
                                        value={input.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                    {validationErrors.email && <p className="text-xs text-red-500 ml-1">{validationErrors.email}</p>}
                                </div>

                                {/* Username */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                                        {t('username')}
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.username ? 'border-red-500' : ''}`}
                                        value={input.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                    />
                                    {validationErrors.username && <p className="text-xs text-red-500 ml-1">{validationErrors.username}</p>}
                                </div>
                            </div>

                            {/* Municipalities */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                                    {t('selectMunicipality')}
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white appearance-none"
                                        value={selectedLocationToAdd}
                                        onChange={(e) => setSelectedLocationToAdd(e.target.value)}
                                    >
                                        <option value="">{t('selectMunicipality')}</option>
                                        {municipalities.map((m) => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        disabled={!selectedLocationToAdd}
                                        onClick={() => {
                                            if (selectedLocationToAdd && !input.location_ids.includes(selectedLocationToAdd)) {
                                                setInput(prev => ({ ...prev, location_ids: [...prev.location_ids, selectedLocationToAdd] }));
                                                setSelectedLocationToAdd('');
                                            }
                                        }}
                                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        {t('add')}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {input.location_ids.map(locId => {
                                        const loc = municipalities.find(m => m.id == locId);
                                        return loc ? (
                                            <span key={locId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800">
                                                {loc.name}
                                                <button
                                                    type="button"
                                                    onClick={() => setInput(prev => ({ ...prev, location_ids: prev.location_ids.filter(id => id !== locId) }))}
                                                    className="hover:text-blue-900 dark:hover:text-blue-100"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                                        {t('newPassword')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showEditPassword ? 'text' : 'password'}
                                            placeholder="Optional"
                                            className={`w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.password ? 'border-red-500' : ''}`}
                                            value={input.password}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            onClick={() => setShowEditPassword(!showEditPassword)}
                                        >
                                            {showEditPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 ml-1">
                                        {t('confirmNewPassword')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showEditConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm"
                                            className={`w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.confirm ? 'border-red-500' : ''}`}
                                            value={input.confirm}
                                            onChange={(e) => handleInputChange('confirm', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                                        >
                                            {showEditConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {input.password && passwordStrength.strength !== 'none' && (
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' : passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            style={{ width: `${passwordStrength.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-right text-neutral-500">{passwordStrength.strength}</p>
                                </div>
                            )}

                            {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

                            <div className="pt-2 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors text-sm"
                                >
                                    {t('deleteAccount')}
                                </button>
                                <div className="flex-1 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-medium transition-colors text-sm"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                    >
                                        {loading ? t('updating') : t('updateAccount')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Login/Signup Modal
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden transform transition-all scale-100 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors z-10"
                    onClick={onClose}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="p-8">
                    {view === 'forgotPassword' ? (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                    {t('resetPassword')}
                                </h2>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                    {t('enterEmailReset')}
                                </p>
                            </div>
                            <form className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder={t('emailAddress')}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="w-full py-3.5 bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t('sendResetLink')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="w-full py-2 text-[#0056b3] hover:text-[#004494] dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                >
                                    {t('backToHome')}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                    {view === 'signup' ? t('createAccountTitle') : t('loginTitle')}
                                </h2>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                    {view === 'signup' ? t('createAccountDesc') : t('loginDesc')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {view === 'signup' ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                </div>
                                                <input
                                                    type="email"
                                                    aria-label="email"
                                                    placeholder={t('emailPlaceholder')}
                                                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.email ? 'border-red-500' : ''}`}
                                                    value={input.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                />
                                            </div>
                                            {validationErrors.email && <p className="text-xs text-red-500 ml-1">{validationErrors.email}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder={t('usernamePlaceholder')}
                                                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.username ? 'border-red-500' : ''}`}
                                                    value={input.username}
                                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                                />
                                            </div>
                                            {validationErrors.username && <p className="text-xs text-red-500 ml-1">{validationErrors.username}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1.5">
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <input
                                                type="text"
                                                aria-label="emailOrUsername"
                                                placeholder={t('emailOrUsernamePlaceholder')}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                                                value={input.emailOrUsername}
                                                onChange={(e) => setInput(i => ({ ...i, emailOrUsername: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            aria-label="password"
                                            placeholder={t('password')}
                                            className={`w-full pl-11 pr-12 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.password ? 'border-red-500' : ''}`}
                                            value={input.password}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {validationErrors.password && <p className="text-xs text-red-500 ml-1">{validationErrors.password}</p>}
                                </div>

                                {view === 'signup' && (
                                    <div className="space-y-1.5">
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            </div>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder={t('confirmPassword')}
                                                className={`w-full pl-11 pr-12 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white ${validationErrors.confirm ? 'border-red-500' : ''}`}
                                                value={input.confirm}
                                                onChange={(e) => handleInputChange('confirm', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                        {validationErrors.confirm && <p className="text-xs text-red-500 ml-1">{validationErrors.confirm}</p>}
                                    </div>
                                )}

                                {view === 'signup' && input.password && passwordStrength.strength !== 'none' && (
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' : passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${passwordStrength.percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-right text-neutral-500">{passwordStrength.strength}</p>
                                    </div>
                                )}

                                {view === 'login' && (
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                            onClick={() => setView('forgotPassword')}
                                        >
                                            {t('forgotPassword')}
                                        </button>
                                    </div>
                                )}

                                {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('processing') : view === 'signup' ? t('signUp') : t('signIn')}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-neutral-500 dark:text-neutral-400">
                                    {view === 'signup' ? t('haveAccount') : t('noAccount')}{' '}
                                    <button
                                        onClick={() => {
                                            setView(view === 'signup' ? 'login' : 'signup');
                                            setError('');
                                            setValidationErrors({});
                                        }}
                                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                    >
                                        {view === 'signup' ? t('signIn') : t('signUp')}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

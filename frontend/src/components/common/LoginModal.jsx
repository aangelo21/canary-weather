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

    const [isSignUp, setIsSignUp] = useState(false);

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

        if (isSignUp) {
            const errors = {};

            // Validate email
            const emailValidation = validateEmail(input.email);
            if (!emailValidation.isValid) {
                errors.email = emailValidation.error;
            }

            // Validate username
            const usernameValidation = validateUsername(input.username);
            if (!usernameValidation.isValid) {
                errors.username = usernameValidation.error;
            }

            // Validate password
            const passwordValidation = validatePassword(input.password);
            if (!passwordValidation.isValid) {
                errors.password = passwordValidation.errors.join('. ');
            }

            // Validate password match
            const matchValidation = validatePasswordMatch(
                input.password,
                input.confirm,
            );
            if (!matchValidation.isValid) {
                errors.confirm = matchValidation.error;
            }

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

    // Handle password input change with strength indicator
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setInput((prev) => ({ ...prev, password: newPassword }));

        // Calculate strength for both signup and edit profile modes
        if (isSignUp || user) {
            const strength = getPasswordStrength(newPassword);
            setPasswordStrength(strength);

            // Clear password error when typing
            if (validationErrors.password) {
                setValidationErrors((prev) => {
                    const { password, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    // Handle input changes and clear corresponding errors
    const handleInputChange = (field, value) => {
        setInput((prev) => ({ ...prev, [field]: value }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors((prev) => {
                const { [field]: removed, ...rest } = prev;
                return rest;
            });
        }
    };

    if (!isOpen) return null;

    if (showDeleteConfirm) {
        return (
            <>
                <div
                    className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowDeleteConfirm(false)}
                ></div>
                <div
                    className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-lg shadow-lg border w-full max-w-sm relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-neutral-2 hover:text-neutral-1 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setShowDeleteConfirm(false)}
                            type="button"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
                            {t('deleteAccount')}
                        </h2>
                        <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
                            {t('confirmDeleteAccount')}
                        </p>
                        {error && (
                            <div className="text-error text-sm mb-2 text-center">
                                {error}
                            </div>
                        )}
                        {loading && (
                            <div className="text-info text-sm mb-2 text-center">
                                {t('deletingAccount')}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                className="bg-neutral-2 text-white px-4 py-2 rounded hover:bg-neutral-1 flex-1"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={loading}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
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
                                {loading
                                    ? t('deletingAccount').split('...')[0] +
                                      '...'
                                    : t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (user) {
        return (
            <>
                <div
                    className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>
                <div
                    className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                    onClick={onClose}
                >
                    <div
                        className="w-full max-w-[350px] rounded-xl border shadow bg-white dark:bg-gray-900 dark:border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
                                {t('editProfile')}
                            </h3>
                            <p className="text-sm text-muted-foreground text-gray-500 dark:text-gray-400">
                                {t('editProfileDesc') ||
                                    'Actualiza tu información personal'}
                            </p>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative group">
                                    <button
                                        onClick={handleImageClick}
                                        disabled={uploading}
                                        type="button"
                                        className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600 hover:border-blue-700 transition-all cursor-pointer"
                                        title={t('changeProfilePic')}
                                    >
                                        {getProfileImageUrl() ? (
                                            <img
                                                src={getProfileImageUrl()}
                                                alt={t('profile')}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <svg
                                                    className="w-10 h-10 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                            <svg
                                                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
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
                                        </div>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {t('clickToChangePhoto')}
                                </p>
                            </div>
                            {uploading && (
                                <div className="text-blue-600 dark:text-blue-400 text-sm mb-2 text-center">
                                    {t('uploadingPhoto')}
                                </div>
                            )}
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setError('');
                                    setValidationErrors({});

                                    const errors = {};

                                    // Validar email si se proporciona
                                    if (input.email && input.email.trim()) {
                                        const emailValidation =
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        if (
                                            !emailValidation.test(input.email)
                                        ) {
                                            errors.email =
                                                t('invalidEmail') ||
                                                'Email inválido';
                                        }
                                    }

                                    // Validar username si se proporciona
                                    if (
                                        input.username &&
                                        input.username.trim()
                                    ) {
                                        const usernameValidation =
                                            /^[a-zA-Z0-9_]{3,20}$/;
                                        if (
                                            !usernameValidation.test(
                                                input.username,
                                            )
                                        ) {
                                            errors.username =
                                                t('invalidUsername') ||
                                                'Usuario debe tener 3-20 caracteres (letras, números, _)';
                                        }
                                    }

                                    // Validar contraseña si se proporciona
                                    if (input.password) {
                                        const passwordValidation =
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/;
                                        if (
                                            !passwordValidation.test(
                                                input.password,
                                            )
                                        ) {
                                            errors.password =
                                                t('invalidPassword') ||
                                                'Contraseña debe tener 6-20 caracteres, mayúscula, minúscula, número y símbolo';
                                        }

                                        if (input.password !== input.confirm) {
                                            errors.confirm =
                                                t('passwordsDontMatch') ||
                                                'Las contraseñas no coinciden';
                                        }
                                    }

                                    if (Object.keys(errors).length > 0) {
                                        setValidationErrors(errors);
                                        return;
                                    }

                                    setLoading(true);
                                    try {
                                        const updateData = {};
                                        if (input.email && input.email.trim())
                                            updateData.email = input.email;
                                        if (
                                            input.username &&
                                            input.username.trim()
                                        )
                                            updateData.username =
                                                input.username;
                                        if (input.password)
                                            updateData.password =
                                                input.password;
                                        if (input.location_ids)
                                            updateData.location_ids =
                                                input.location_ids;
                                        const result = await createOrUpdateUser(
                                            updateData,
                                            user.id,
                                        );
                                        setLoading(false);
                                        if (result) {
                                            onLogin(result);
                                            onClose();
                                        }
                                    } catch (err) {
                                        setLoading(false);
                                        setError(
                                            err.message || t('errorUpdateUser'),
                                        );
                                    }
                                }}
                            >
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                            htmlFor="edit-email"
                                        >
                                            {t('email')}
                                        </label>
                                        <input
                                            id="edit-email"
                                            type="email"
                                            placeholder={t('emailPlaceholder')}
                                            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                                            value={input.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {validationErrors.email && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                {validationErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                            htmlFor="edit-username"
                                        >
                                            {t('username')}
                                        </label>
                                        <input
                                            id="edit-username"
                                            type="text"
                                            placeholder={t(
                                                'usernamePlaceholder',
                                            )}
                                            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.username ? 'border-red-500 dark:border-red-500' : ''}`}
                                            value={input.username}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'username',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {validationErrors.username && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                {validationErrors.username}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                            htmlFor="edit-municipality-select"
                                        >
                                            {t('selectMunicipality')}
                                        </label>
                                        <div className="flex gap-2 w-full min-w-0">
                                            <select
                                                id="edit-municipality-select"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:bg-gray-800 flex-1 min-w-0"
                                                value={selectedLocationToAdd}
                                                onChange={(e) =>
                                                    setSelectedLocationToAdd(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    {t('selectMunicipality')}
                                                </option>
                                                {municipalities.map(
                                                    (municipality) => (
                                                        <option
                                                            key={
                                                                municipality.id
                                                            }
                                                            value={
                                                                municipality.id
                                                            }
                                                        >
                                                            {municipality.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <button
                                                type="button"
                                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-brand-primary text-white shadow hover:bg-blue-700 h-9 px-4 py-2 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                                disabled={
                                                    !selectedLocationToAdd
                                                }
                                                onClick={() => {
                                                    if (
                                                        selectedLocationToAdd &&
                                                        !input.location_ids.includes(
                                                            selectedLocationToAdd,
                                                        )
                                                    ) {
                                                        setInput((prev) => ({
                                                            ...prev,
                                                            location_ids: [
                                                                ...prev.location_ids,
                                                                selectedLocationToAdd,
                                                            ],
                                                        }));
                                                        setSelectedLocationToAdd(
                                                            '',
                                                        );
                                                    }
                                                }}
                                            >
                                                {t('add')}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {input.location_ids &&
                                                input.location_ids.map(
                                                    (locId) => {
                                                        const loc =
                                                            municipalities.find(
                                                                (m) =>
                                                                    m.id ==
                                                                    locId,
                                                            );
                                                        return loc ? (
                                                            <span
                                                                key={locId}
                                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                                            >
                                                                {loc.name}
                                                                <button
                                                                    type="button"
                                                                    className="hover:text-blue-900 font-bold"
                                                                    aria-label={
                                                                        t(
                                                                            'remove',
                                                                        ) ||
                                                                        'Remove'
                                                                    }
                                                                    onClick={() => {
                                                                        setInput(
                                                                            (
                                                                                prev,
                                                                            ) => ({
                                                                                ...prev,
                                                                                location_ids:
                                                                                    prev.location_ids.filter(
                                                                                        (
                                                                                            id,
                                                                                        ) =>
                                                                                            id !==
                                                                                            locId,
                                                                                    ),
                                                                            }),
                                                                        );
                                                                    }}
                                                                >
                                                                    &times;
                                                                </button>
                                                            </span>
                                                        ) : null;
                                                    },
                                                )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                            htmlFor="edit-password"
                                        >
                                            {t('newPassword') || t('password')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="edit-password"
                                                type={
                                                    showEditPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="6-20 chars, A-Z, a-z, 0-9, !@#$"
                                                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.password ? 'border-red-500 dark:border-red-500' : ''}`}
                                                value={input.password}
                                                onChange={handlePasswordChange}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                onClick={() =>
                                                    setShowEditPassword(
                                                        !showEditPassword,
                                                    )
                                                }
                                                tabIndex={-1}
                                            >
                                                {showEditPassword ? (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {input.password &&
                                            passwordStrength.strength !==
                                                'none' && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                                                                ? t('weak') ||
                                                                  'Weak'
                                                                : passwordStrength.strength ===
                                                                    'medium'
                                                                  ? t(
                                                                        'medium',
                                                                    ) ||
                                                                    'Medium'
                                                                  : t(
                                                                        'strong',
                                                                    ) ||
                                                                    'Strong'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        {validationErrors.password && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                {validationErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                            htmlFor="edit-confirm"
                                        >
                                            {t('confirmNewPassword') ||
                                                t('confirmPassword')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="edit-confirm"
                                                type={
                                                    showEditConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.confirm ? 'border-red-500 dark:border-red-500' : ''}`}
                                                value={input.confirm}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'confirm',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                onClick={() =>
                                                    setShowEditConfirmPassword(
                                                        !showEditConfirmPassword,
                                                    )
                                                }
                                                tabIndex={-1}
                                            >
                                                {showEditConfirmPassword ? (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {validationErrors.confirm && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                {validationErrors.confirm}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-red-500 text-sm mt-4 text-center">
                                        {error}
                                    </div>
                                )}
                                {loading && (
                                    <div className="text-blue-500 text-sm mt-4 text-center">
                                        {t('updating')}
                                    </div>
                                )}
                                <div className="flex items-center pt-4 justify-between">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 border-gray-200 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                        onClick={onClose}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-brand-primary text-white shadow hover:bg-blue-700 h-9 px-4 py-2 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? t('updating')
                                            : t('updateAccount')}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 pt-0">
                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white shadow hover:bg-red-700 h-9 px-4 py-2 w-full"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                {t('deleteAccount')}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div
                className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div
                className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-[350px] rounded-xl border shadow bg-white dark:bg-gray-900 dark:border-gray-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
                            {isSignUp
                                ? t('createAccountTitle')
                                : t('loginTitle')}
                        </h3>
                        <p className="text-sm text-muted-foreground text-gray-500 dark:text-gray-400">
                            {isSignUp ? t('createAccountDesc') : t('loginDesc')}
                        </p>
                    </div>
                    <div className="p-6 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                {isSignUp ? (
                                    <>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="email"
                                            >
                                                {t('email')}
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder={t(
                                                    'emailPlaceholder',
                                                )}
                                                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                                                value={input.email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {validationErrors.email && (
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    {validationErrors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="username"
                                            >
                                                {t('username')}
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                placeholder={t(
                                                    'usernamePlaceholder',
                                                )}
                                                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.username ? 'border-red-500 dark:border-red-500' : ''}`}
                                                value={input.username}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'username',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {validationErrors.username && (
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    {validationErrors.username}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="password"
                                            >
                                                {t('password')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="6-20 chars, A-Z, a-z, 0-9, !@#$"
                                                    className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.password ? 'border-red-500 dark:border-red-500' : ''}`}
                                                    value={input.password}
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            {input.password &&
                                                passwordStrength.strength !==
                                                    'none' && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                                                                    ? t(
                                                                          'weak',
                                                                      ) ||
                                                                      'Weak'
                                                                    : passwordStrength.strength ===
                                                                        'medium'
                                                                      ? t(
                                                                            'medium',
                                                                        ) ||
                                                                        'Medium'
                                                                      : t(
                                                                            'strong',
                                                                        ) ||
                                                                        'Strong'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            {validationErrors.password && (
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    {validationErrors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="confirm"
                                            >
                                                {t('confirmPassword')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="confirm"
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${validationErrors.confirm ? 'border-red-500 dark:border-red-500' : ''}`}
                                                    value={input.confirm}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'confirm',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword,
                                                        )
                                                    }
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            {validationErrors.confirm && (
                                                <p className="text-xs text-red-600 dark:text-red-400">
                                                    {validationErrors.confirm}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="municipality-select"
                                            >
                                                {t('selectMunicipality')}
                                            </label>
                                            <div className="flex gap-2 w-full min-w-0">
                                                <select
                                                    id="municipality-select"
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:bg-gray-800 flex-1 min-w-0"
                                                    value={
                                                        selectedLocationToAdd
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedLocationToAdd(
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        {t(
                                                            'selectMunicipality',
                                                        )}
                                                    </option>
                                                    {municipalities.map(
                                                        (municipality) => (
                                                            <option
                                                                key={
                                                                    municipality.id
                                                                }
                                                                value={
                                                                    municipality.id
                                                                }
                                                            >
                                                                {
                                                                    municipality.name
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-brand-primary text-white shadow hover:bg-blue-700 h-9 px-4 py-2 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                                    disabled={
                                                        !selectedLocationToAdd
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            selectedLocationToAdd &&
                                                            !input.location_ids.includes(
                                                                selectedLocationToAdd,
                                                            )
                                                        ) {
                                                            setInput(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    location_ids:
                                                                        [
                                                                            ...prev.location_ids,
                                                                            selectedLocationToAdd,
                                                                        ],
                                                                }),
                                                            );
                                                            setSelectedLocationToAdd(
                                                                '',
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {t('add')}
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {input.location_ids &&
                                                    input.location_ids.map(
                                                        (locId) => {
                                                            const loc =
                                                                municipalities.find(
                                                                    (m) =>
                                                                        m.id ==
                                                                        locId,
                                                                );
                                                            return loc ? (
                                                                <span
                                                                    key={locId}
                                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                                                >
                                                                    {loc.name}
                                                                    <button
                                                                        type="button"
                                                                        className="hover:text-blue-900 font-bold"
                                                                        aria-label={
                                                                            t(
                                                                                'remove',
                                                                            ) ||
                                                                            'Remove'
                                                                        }
                                                                        onClick={() => {
                                                                            setInput(
                                                                                (
                                                                                    prev,
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    location_ids:
                                                                                        prev.location_ids.filter(
                                                                                            (
                                                                                                id,
                                                                                            ) =>
                                                                                                id !==
                                                                                                locId,
                                                                                        ),
                                                                                }),
                                                                            );
                                                                        }}
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            ) : null;
                                                        },
                                                    )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="emailOrUsername"
                                            >
                                                {t('emailOrUsername')}
                                            </label>
                                            <input
                                                id="emailOrUsername"
                                                type="text"
                                                placeholder={t(
                                                    'emailOrUsernamePlaceholder',
                                                )}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                value={input.emailOrUsername}
                                                onChange={(e) =>
                                                    setInput((i) => ({
                                                        ...i,
                                                        emailOrUsername:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="password"
                                            >
                                                {t('password')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                    value={input.password}
                                                    onChange={(e) =>
                                                        setInput((i) => ({
                                                            ...i,
                                                            password:
                                                                e.target.value,
                                                        }))
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Link
                                                to="/forgot-password"
                                                className="text-xs text-brand-primary hover:underline dark:text-blue-400"
                                                onClick={onClose}
                                            >
                                                {t('forgotPassword')}
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm mt-4 text-center">
                                    {error}
                                </div>
                            )}
                            {loading && (
                                <div className="text-blue-500 text-sm mt-4 text-center">
                                    {t('processing')}
                                </div>
                            )}
                            <div className="flex items-center pt-4 justify-between">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 border-gray-200 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                    onClick={onClose}
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-brand-primary text-white shadow hover:bg-blue-700 h-9 px-4 py-2 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                    disabled={loading}
                                >
                                    {isSignUp ? t('signUp') : t('signIn')}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="p-6 pt-0 text-center text-sm text-gray-500 dark:text-gray-400">
                        {!isSignUp ? (
                            <span>
                                {t('noAccount')}{' '}
                                <button
                                    type="button"
                                    className="text-brand-primary hover:underline dark:text-blue-400"
                                    onClick={() => setIsSignUp(true)}
                                >
                                    {t('signUp')}
                                </button>
                            </span>
                        ) : (
                            <span>
                                {t('haveAccount')}{' '}
                                <button
                                    type="button"
                                    className="text-brand-primary hover:underline dark:text-blue-400"
                                    onClick={() => setIsSignUp(false)}
                                >
                                    {t('signIn')}
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

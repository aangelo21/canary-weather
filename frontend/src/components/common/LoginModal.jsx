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

/**
 * LoginModal Component.
 *
 * This component provides a modal interface for user authentication and profile management.
 * It handles:
 * - User Login: Allows users to sign in with email/username and password.
 * - User Registration: Allows new users to create an account with email, username, password, and preferred locations.
 * - Profile Editing: Allows logged-in users to update their username, email, password, and profile picture.
 * - Account Deletion: Provides a confirmation flow for users to permanently delete their account.
 *
 * The component manages its own state for form inputs, loading status, errors, and visibility of sub-modals (like delete confirmation).
 * It interacts with the `userService` to perform API operations.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal. If false, the component returns null.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {Function} props.onLogin - Callback function executed upon successful login or profile update. Receives the user object.
 * @param {Object} [props.user] - The currently logged-in user object. If present, the modal shows the "Edit Profile" view.
 * @param {Function} props.onLogout - Callback function executed when the user logs out or deletes their account.
 * @returns {JSX.Element|null} The rendered LoginModal component or null if `isOpen` is false.
 */
export default function LoginModal({
    isOpen,
    onClose,
    onLogin,
    user,
    onLogout,
}) {
    const { t } = useTranslation();
    
    /**
     * @type {[boolean, Function]} isSignUp - State to toggle between Login and Sign Up forms.
     */
    const [isSignUp, setIsSignUp] = useState(false);

    /**
     * @type {[boolean, Function]} showDeleteConfirm - State to control the visibility of the delete account confirmation dialog.
     */
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /**
     * @type {[Object, Function]} input - State to hold form input values.
     * @property {string} emailOrUsername - Input for login (email or username).
     * @property {string} password - Input for password.
     * @property {string} username - Input for new username (signup/edit).
     * @property {string} email - Input for new email (signup/edit).
     * @property {string} confirm - Input for password confirmation (signup/edit).
     * @property {Array<number>} location_ids - Array of selected location IDs (signup/edit).
     */
    const [input, setInput] = useState({
        emailOrUsername: '',
        password: '',
        username: '',
        email: '',
        confirm: '',
        location_ids: [],
    });

    /**
     * @type {[string, Function]} selectedLocationToAdd - State for the currently selected location in the dropdown to be added.
     */
    const [selectedLocationToAdd, setSelectedLocationToAdd] = useState('');

    /**
     * @type {[string, Function]} error - State to hold error messages to display to the user.
     */
    const [error, setError] = useState('');

    /**
     * @type {[boolean, Function]} loading - State to indicate if an API request is in progress.
     */
    const [loading, setLoading] = useState(false);

    /**
     * @type {[Array<Object>, Function]} municipalities - State to store the list of available municipalities for location selection.
     */
    const [municipalities, setMunicipalities] = useState([]);

    /**
     * @type {[boolean, Function]} uploading - State to indicate if a profile picture upload is in progress.
     */
    const [uploading, setUploading] = useState(false);

    /**
     * @type {React.RefObject<HTMLInputElement>} fileInputRef - Reference to the hidden file input element for image upload.
     */
    const fileInputRef = useRef(null);
    
    const API_BASE = import.meta.env.VITE_API_BASE;

    /**
     * Effect hook to initialize form state when the modal opens or the user prop changes.
     * If a user is logged in, it pre-fills the form with user data for editing.
     * It also fetches the latest user data to ensure location preferences are up-to-date.
     */
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
                    console.error('Error refreshing user data:', err)
                );
        }
    }, [user, isOpen]);

    /**
     * Effect hook to fetch the list of municipalities when the modal is opened.
     * This data is used for the location selection dropdown.
     */
    useEffect(() => {
        if (isOpen) {
            fetchMunicipalities()
                .then(setMunicipalities)
                .catch((err) =>
                    console.error('Error loading municipalities:', err)
                );
        }
    }, [isOpen]);

    /**
     * Triggers the hidden file input click event to open the file selection dialog.
     * This allows the user to select a new profile picture.
     */
    const handleImageClick = () => {
        if (user && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    /**
     * Handles the selection of a new profile picture.
     * Uploads the selected file to the server and updates the user's profile.
     *
     * @param {Event} e - The change event from the file input.
     * @returns {Promise<void>}
     */
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

    /**
     * Constructs the full URL for the user's profile picture.
     *
     * @returns {string|null} The full URL of the profile picture, or null if the user has no profile picture.
     */
    const getProfileImageUrl = () => {
        if (user?.profile_picture_url) {
            const baseUrl = API_BASE.replace('/api', '');
            return `${baseUrl}${user.profile_picture_url}`;
        }
        return null;
    };

    /**
     * Handles the form submission for login, signup, or profile update.
     * Validates input fields and calls the appropriate service function.
     *
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (isSignUp) {
            if (
                !input.email ||
                !input.username ||
                !input.password ||
                !input.confirm
            ) {
                setError(t('allFieldsRequired'));
                return;
            }
            if (input.password !== input.confirm) {
                setError(t('passwordsDontMatch'));
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
                setError(err.message || t('errorCreateUser'));
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
                                            err.message || t('errorDeleteUser')
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
                <div className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                <div
                    className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                    onClick={onClose}
                >
                    <div
                        className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-lg shadow-lg border w-full max-w-sm relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={onClose}
                            type="button"
                            aria-label={t('close') || 'Close'}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
                            {t('editProfile')}
                        </h2>
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
                            <p className="text-sm text-gray-600 mt-2">
                                {t('clickToChangePhoto')}
                            </p>
                        </div>
                        {error && (
                            <div className="text-error text-sm mb-2 text-center">
                                {error}
                            </div>
                        )}
                        {loading && (
                            <div className="text-info text-sm mb-2 text-center">
                                {t('updating')}
                            </div>
                        )}
                        {uploading && (
                            <div className="text-blue-600 text-sm mb-2 text-center">
                                {t('uploadingPhoto')}
                            </div>
                        )}
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setError('');
                                if (
                                    input.password &&
                                    input.password !== input.confirm
                                ) {
                                    setError(t('passwordsDontMatch'));
                                    return;
                                }
                                setLoading(true);
                                try {
                                    const updateData = {};
                                    if (input.email.trim())
                                        updateData.email = input.email;
                                    if (input.username.trim())
                                        updateData.username = input.username;
                                    if (input.password)
                                        updateData.password = input.password;
                                    if (input.location_ids)
                                        updateData.location_ids =
                                            input.location_ids;
                                    const result = await createOrUpdateUser(
                                        updateData,
                                        user.id
                                    );
                                    setLoading(false);
                                    if (result) {
                                        onLogin(result);
                                        onClose();
                                    }
                                } catch (err) {
                                    setLoading(false);
                                    setError(
                                        err.message || t('errorUpdateUser')
                                    );
                                }
                            }}
                        >
                            <input
                                type="email"
                                placeholder={t('email')}
                                aria-label={t('email')}
                                className="border rounded px-3 py-2"
                                value={input.email}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        email: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="text"
                                placeholder={t('username')}
                                aria-label={t('username')}
                                className="border rounded px-3 py-2"
                                value={input.username}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        username: e.target.value,
                                    }))
                                }
                            />
                            <div className="flex gap-2 w-full min-w-0">
                                <select
                                    className="border rounded px-3 py-2 flex-1 min-w-0"
                                    value={selectedLocationToAdd}
                                    aria-label={t('selectMunicipality')}
                                    onChange={(e) =>
                                        setSelectedLocationToAdd(e.target.value)
                                    }
                                >
                                    <option value="">
                                        {t('selectMunicipality')}
                                    </option>
                                    {municipalities.map((municipality) => (
                                        <option
                                            key={municipality.id}
                                            value={municipality.id}
                                        >
                                            {municipality.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex-none whitespace-nowrap"
                                    disabled={!selectedLocationToAdd}
                                    onClick={() => {
                                        if (
                                            selectedLocationToAdd &&
                                            !input.location_ids.includes(
                                                selectedLocationToAdd
                                            )
                                        ) {
                                            setInput((prev) => ({
                                                ...prev,
                                                location_ids: [
                                                    ...prev.location_ids,
                                                    selectedLocationToAdd,
                                                ],
                                            }));
                                            setSelectedLocationToAdd('');
                                        }
                                    }}
                                >
                                    {t('add')}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                                {input.location_ids &&
                                    input.location_ids.map((locId) => {
                                        const loc = municipalities.find(
                                            (m) => m.id == locId
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
                                                    aria-label={t('remove') || 'Remove'}
                                                    onClick={() => {
                                                        setInput((prev) => ({
                                                            ...prev,
                                                            location_ids:
                                                                prev.location_ids.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        locId
                                                                ),
                                                        }));
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                            </div>
                            <input
                                type="password"
                                placeholder={t('newPassword')}
                                className="border rounded px-3 py-2"
                                value={input.password}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        password: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="password"
                                placeholder={t('confirmNewPassword')}
                                className="border rounded px-3 py-2"
                                value={input.confirm}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        confirm: e.target.value,
                                    }))
                                }
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
                                disabled={loading}
                            >
                                {loading ? t('updating') : t('updateAccount')}
                            </button>
                        </form>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full mt-4"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            {t('deleteAccount')}
                        </button>
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
                                                placeholder={t('emailPlaceholder')}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                value={input.email}
                                                onChange={(e) =>
                                                    setInput((i) => ({
                                                        ...i,
                                                        email: e.target.value,
                                                    }))
                                                }
                                            />
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
                                                placeholder={t('usernamePlaceholder')}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                value={input.username}
                                                onChange={(e) =>
                                                    setInput((i) => ({
                                                        ...i,
                                                        username: e.target.value,
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
                                            <input
                                                id="password"
                                                type="password"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                value={input.password}
                                                onChange={(e) =>
                                                    setInput((i) => ({
                                                        ...i,
                                                        password: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
                                                htmlFor="confirm"
                                            >
                                                {t('confirmPassword')}
                                            </label>
                                            <input
                                                id="confirm"
                                                type="password"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                value={input.confirm}
                                                onChange={(e) =>
                                                    setInput((i) => ({
                                                        ...i,
                                                        confirm: e.target.value,
                                                    }))
                                                }
                                            />
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
                                                    value={selectedLocationToAdd}
                                                    onChange={(e) =>
                                                        setSelectedLocationToAdd(
                                                            e.target.value
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
                                                                {
                                                                    municipality.name
                                                                }
                                                            </option>
                                                        )
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
                                                                selectedLocationToAdd
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
                                                                })
                                                            );
                                                            setSelectedLocationToAdd(
                                                                ''
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
                                                                        locId
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
                                                                        aria-label={t('remove') || 'Remove'}
                                                                        onClick={() => {
                                                                            setInput(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    location_ids:
                                                                                        prev.location_ids.filter(
                                                                                            (
                                                                                                id
                                                                                            ) =>
                                                                                                id !==
                                                                                                locId
                                                                                        ),
                                                                                })
                                                                            );
                                                                        }}
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            ) : null;
                                                        }
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
                                                placeholder={t('emailOrUsernamePlaceholder')}
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
                                            <input
                                                id="password"
                                                type="password"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                                                value={input.password}
                                                onChange={(e) =>
                                                    setInput((i) => ({
                                                        ...i,
                                                        password: e.target.value,
                                                    }))
                                                }
                                            />
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
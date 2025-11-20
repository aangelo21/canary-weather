// LoginModal.jsx - Authentication modal component
// This component handles user authentication including login, signup, account editing,
// and account deletion. It provides a modal interface with form validation and
// integrates with the user service for API calls.

import { useState, useEffect } from "react";
import {
  createOrUpdateUser,
  loginUser,
  deleteUser,
  fetchMunicipalities,
} from "../services/userService";
import { useTranslation } from "react-i18next";

// LoginModal component - Main authentication interface
// Supports multiple modes: login, signup, account editing, and account deletion
// Manages user session state and localStorage for persistence
export default function LoginModal({
  isOpen, // Boolean to control modal visibility
  onClose, // Function to close the modal
  onLogin, // Function called when user successfully logs in
  user, // Current user object (if logged in)
  onLogout, // Function called when user logs out
}) {
    const { t } = useTranslation();
    // State to toggle between login and signup modes
    const [isSignUp, setIsSignUp] = useState(false);
    // State to show delete account confirmation dialog
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    // State object for all form input values
    const [input, setInput] = useState({
        emailOrUsername: "",  // For login form
        password: "",         // For both login and signup
        username: "",         // For signup and account editing
        email: "",            // For signup and account editing
        confirm: "",          // Password confirmation for signup/editing
        default_location_id: "", // For signup and account editing
    });
    // State for displaying error messages
    const [error, setError] = useState("");
    // State for loading indicators during API calls
    const [loading, setLoading] = useState(false);
    // State for municipalities data
    const [municipalities, setMunicipalities] = useState([]);

    // useEffect hook - Populates form fields when editing existing user account
    // Runs when user data changes or modal opens
    useEffect(() => {
        if (user && isOpen) {
            setInput({
                email: user.email || "",
                username: user.username || "",
                password: "",
                confirm: "",
                emailOrUsername: "",
                default_location_id: user.default_location_id || "",
            });
        }
    }, [user, isOpen]);

    // useEffect hook - Loads municipalities when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchMunicipalities()
                .then(setMunicipalities)
                .catch(err => console.error("Error loading municipalities:", err));
        }
    }, [isOpen]);

    // Early return if modal is not open
    if (!isOpen) return null;

    // Render delete account confirmation modal
    if (showDeleteConfirm) {
        return (
            <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-9998" onClick={() => setShowDeleteConfirm(false)}></div>
                {/* Modal container */}
                <div className="fixed inset-0 flex items-center justify-center z-9999 p-4" onClick={() => setShowDeleteConfirm(false)}>
                <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                    {/* Close button */}
                    <button
                        className="absolute top-2 right-2 text-neutral-2 hover:text-neutral-1"
                        onClick={() => setShowDeleteConfirm(false)}
                        type="button"
                    >
                        &times;
                    </button>
                    {/* Modal title */}
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        {t('deleteAccount')}
                    </h2>
                    {/* Warning message */}
                    <p className="text-center mb-6">
                        {t('confirmDeleteAccount')}
                    </p>
                    {/* Error message display */}
                    {error && (
                        <div className="text-error text-sm mb-2 text-center">
                            {error}
                        </div>
                    )}
                    {/* Loading message */}
                    {loading && (
                        <div className="text-info text-sm mb-2 text-center">
                            {t('deletingAccount')}
                        </div>
                    )}
                    {/* Action buttons */}
                    <div className="flex gap-2">
                        {/* Cancel button */}
                        <button
                            className="bg-neutral-2 text-white px-4 py-2 rounded hover:bg-neutral-1 flex-1"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={loading}
                        >
                            {t('cancel')}
                        </button>
                        {/* Delete button with confirmation */}
                        <button
                            className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    // Call API to delete user account
                                    await deleteUser(user.id);
                                    setLoading(false);
                                    // Log out user and close modal
                                    onLogout();
                                    onClose();
                                } catch (err) {
                                    setLoading(false);
                                    setError(err.message || "Error al eliminar usuario");
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? t('deletingAccount').split('...')[0] + "..." : t('delete')}
                        </button>
                    </div>
                </div>
                </div>
            </>
        );
    }

    // Render account editing modal when user is logged in
    if (user) {
        return (
            <>
                <div className="fixed inset-0 z-9998" onClick={onClose}></div>
                <div className="fixed inset-0 flex items-center justify-center z-9999 p-4" onClick={onClose}>
                <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        type="button"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        {t('editProfile')}
                    </h2>
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
                    {/* Account update form */}
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError("");
                            // Validate password confirmation if password is being changed
                            if (
                                input.password &&
                                input.password !== input.confirm
                            ) {
                                setError(t('passwordsDontMatch'));
                                return;
                            }
                            setLoading(true);
                            try {
                                // Build update data object with only changed fields
                                const updateData = {};
                                if (input.email.trim())
                                    updateData.email = input.email;
                                if (input.username.trim())
                                    updateData.username = input.username;
                                if (input.password)
                                    updateData.password = input.password;
                                if (input.default_location_id)
                                    updateData.default_location_id = input.default_location_id;
                                // Call API to update user account
                                const result = await createOrUpdateUser(
                                    updateData,
                                    user.id
                                );
                                setLoading(false);
                                if (result) {
                                    // Update user state and close modal
                                    onLogin(result);
                                    onClose();
                                }
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || t('errorUpdateUser'));
                            }
                        }}
                    >
                        {/* Email input field */}
                        <input
                            type="email"
                            placeholder={t('email')}
                            className="border rounded px-3 py-2"
                            value={input.email}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    email: e.target.value,
                                }))
                            }
                        />
                        {/* Username input field */}
                        <input
                            type="text"
                            placeholder={t('username')}
                            className="border rounded px-3 py-2"
                            value={input.username}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    username: e.target.value,
                                }))
                            }
                        />
                        {/* Municipality selector */}
                        <select
                            className="border rounded px-3 py-2"
                            value={input.default_location_id}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    default_location_id: e.target.value,
                                }))
                            }
                        >
                            <option value="">{t('selectMunicipality')}</option>
                            {municipalities.map((municipality) => (
                                <option key={municipality.id} value={municipality.id}>
                                    {municipality.name}
                                </option>
                            ))}
                        </select>
                        {/* New password input (optional) */}
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
                        {/* Password confirmation input */}
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
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
                            disabled={loading}
                        >
                            {loading ? t('updating') : t('updateAccount')}
                        </button>
                    </form>
                    {/* Delete account button */}
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

    // Render main login/signup modal
    return (
        <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 z-9998" onClick={onClose}></div>
            {/* Modal container */}
            <div
                className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        type="button"
                    >
                        &times;
                    </button>
                    {/* Mode toggle text */}
                    <div className="mb-2 text-sm text-center">
                        {!isSignUp ? (
                            <span>
                                {t('noAccount')}{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline"
                                    onClick={() => setIsSignUp(true)}
                                >
                                    {t('signUp')}
                                </button>
                            </span>
                        ) : (
                            <span>
                                {t('haveAccount')}{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline"
                                    onClick={() => setIsSignUp(false)}
                                >
                                    {t('signIn')}
                                </button>
                            </span>
                        )}
                    </div>
                    {/* Modal title */}
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        {isSignUp ? t('signUp') : t('signIn')}
                    </h2>
                    {/* Error message display */}
                    {error && (
                        <div className="text-error text-sm mb-2 text-center">
                            {error}
                        </div>
                    )}
                    {/* Loading message */}
                    {loading && (
                        <div className="text-info text-sm mb-2 text-center">
                            {t('processing')}
                        </div>
                    )}
                    {/* Main authentication form */}
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError("");
                            if (isSignUp) {
                                // Signup validation
                                if (
                                    !input.email ||
                                    !input.username ||
                                    !input.password ||
                                    !input.confirm ||
                                    !input.default_location_id
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
                                    // Call API to create new user account
                                    const result = await createOrUpdateUser({
                                        email: input.email,
                                        username: input.username,
                                        password: input.password,
                                        default_location_id: input.default_location_id,
                                    });
                                    setLoading(false);
                                    if (result && result.token) {
                                        // Store authentication token
                                        localStorage.setItem(
                                            "authToken",
                                            result.token
                                        );
                                        // Build user object from response
                                        let loggedUser = {
                                            username: input.username,
                                        };
                                        if (result.user) loggedUser = result.user;
                                        else if (
                                            result.id ||
                                            result.username ||
                                            result.email
                                        ) {
                                            loggedUser = {
                                                id: result.id,
                                                username:
                                                    result.username ||
                                                    input.username,
                                                email: result.email,
                                            };
                                        }
                                        // Store user ID in localStorage
                                        if (loggedUser.id)
                                            localStorage.setItem(
                                                "userId",
                                                loggedUser.id
                                            );
                                        // Call onLogin callback
                                        onLogin(loggedUser);
                                    } else {
                                        onLogin(result);
                                    }
                                } catch (err) {
                                    setLoading(false);
                                    setError(err.message || t('errorCreateUser'));
                                }
                            } else {
                                // Login validation
                                if (!input.emailOrUsername || !input.password) {
                                    setError(t('allFieldsRequired'));
                                    return;
                                }
                                setLoading(true);
                                try {
                                    // Call API to authenticate user
                                    const result = await loginUser({
                                        username: input.emailOrUsername,
                                        password: input.password,
                                    });
                                    setLoading(false);
                                    if (result.token) {
                                        // Store authentication token
                                        localStorage.setItem(
                                            "authToken",
                                            result.token
                                        );
                                        // Build user object from response
                                        let loggedUser = {
                                            username: input.emailOrUsername,
                                        };
                                        if (result.user) loggedUser = result.user;
                                        else if (
                                            result.id ||
                                            result.username ||
                                            result.email
                                        ) {
                                            loggedUser = {
                                                id: result.id,
                                                username:
                                                    result.username ||
                                                    input.emailOrUsername,
                                                email: result.email,
                                            };
                                        }
                                        // Store user ID in localStorage
                                        if (loggedUser.id)
                                            localStorage.setItem(
                                                "userId",
                                                loggedUser.id
                                            );
                                        // Call onLogin callback
                                        onLogin(loggedUser);
                                    } else {
                                        setError(t('noTokenReceived'));
                                    }
                                } catch (err) {
                                    setLoading(false);
                                    setError(err.message || t('errorSignIn'));
                                }
                            }
                        }}
                    >
                        {/* Conditional form fields based on signup/login mode */}
                        {isSignUp ? (
                            <>
                                {/* Signup form fields */}
                                <input
                                    type="email"
                                    placeholder={t('email')}
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
                                    className="border rounded px-3 py-2"
                                    value={input.username}
                                    onChange={(e) =>
                                        setInput((i) => ({
                                            ...i,
                                            username: e.target.value,
                                        }))
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder={t('password')}
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
                                    placeholder={t('confirmPassword')}
                                    className="border rounded px-3 py-2"
                                    value={input.confirm}
                                    onChange={(e) =>
                                        setInput((i) => ({
                                            ...i,
                                            confirm: e.target.value,
                                        }))
                                    }
                                />
                                {/* Municipality selector for signup */}
                                <select
                                    className="border rounded px-3 py-2"
                                    value={input.default_location_id}
                                    onChange={(e) =>
                                        setInput((i) => ({
                                            ...i,
                                            default_location_id: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">{t('selectMunicipality')}</option>
                                    {municipalities.map((municipality) => (
                                        <option key={municipality.id} value={municipality.id}>
                                            {municipality.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                {/* Login form fields */}
                                <input
                                    type="text"
                                    placeholder={t('emailOrUsername')}
                                    className="border rounded px-3 py-2"
                                    value={input.emailOrUsername}
                                    onChange={(e) =>
                                        setInput((i) => ({
                                            ...i,
                                            emailOrUsername: e.target.value,
                                        }))
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder={t('password')}
                                    className="border rounded px-3 py-2"
                                    value={input.password}
                                    onChange={(e) =>
                                        setInput((i) => ({
                                            ...i,
                                            password: e.target.value,
                                        }))
                                    }
                                />
                            </>
                        )}
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isSignUp ? t('signUp') : t('signIn')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
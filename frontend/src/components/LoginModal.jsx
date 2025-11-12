import { useState, useEffect } from "react";
import {
    createOrUpdateUser,
    loginUser,
    deleteUser,
} from "../services/userService";

export default function LoginModal({
    isOpen,
    onClose,
    onLogin,
    user,
    onLogout,
}) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [input, setInput] = useState({
        emailOrUsername: "",
        password: "",
        username: "",
        email: "",
        confirm: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setInput({
                email: user.email || "",
                username: user.username || "",
                password: "",
                confirm: "",
                emailOrUsername: "",
            });
        }
    }, [user, isOpen]);
    if (!isOpen) return null;
    if (showDeleteConfirm) {
        return (
            <>
                <div className="fixed inset-0 z-9998" onClick={() => setShowDeleteConfirm(false)}></div>
                <div className="fixed inset-0 flex items-center justify-center z-9999 p-4" onClick={() => setShowDeleteConfirm(false)}>
                <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-2 right-2 text-neutral-2 hover:text-neutral-1"
                        onClick={() => setShowDeleteConfirm(false)}
                        type="button"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Delete Account
                    </h2>
                    <p className="text-center mb-6">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    {error && (
                        <div className="text-error text-sm mb-2 text-center">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="text-info text-sm mb-2 text-center">
                            Deleting account...
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            className="bg-neutral-2 text-white px-4 py-2 rounded hover:bg-neutral-1 flex-1"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={loading}
                        >
                            Cancel
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
                                    setError(err.message || "Error deleting user");
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
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
                        Edit Account
                    </h2>
                    {error && (
                        <div className="text-error text-sm mb-2 text-center">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="text-info text-sm mb-2 text-center">
                            Processing...
                        </div>
                    )}
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError("");
                            if (
                                input.password &&
                                input.password !== input.confirm
                            ) {
                                setError("Passwords do not match");
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
                                setError(err.message || "Error updating user");
                            }
                        }}
                    >
                        <input
                            type="email"
                            placeholder="Email"
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
                            placeholder="Username"
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
                            placeholder="New Password (optional)"
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
                            placeholder="Confirm New Password"
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
                            {loading ? "Updating..." : "Update Account"}
                        </button>
                    </form>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full mt-4"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete Account
                    </button>
                </div>
                </div>
            </>
        );
    }

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
                <div className="mb-2 text-sm text-center">
                    {!isSignUp ? (
                        <span>
                            Don't have an account with us?{" "}
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => setIsSignUp(true)}
                            >
                                Sign up
                            </button>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => setIsSignUp(false)}
                            >
                                Log in
                            </button>
                        </span>
                    )}
                </div>
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {isSignUp ? "Sign Up" : "Log In"}
                </h2>
                {error && (
                    <div className="text-error text-sm mb-2 text-center">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="text-info text-sm mb-2 text-center">
                        Processing...
                    </div>
                )}
                <form
                    className="flex flex-col gap-4"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError("");
                        if (isSignUp) {
                            if (
                                !input.email ||
                                !input.username ||
                                !input.password ||
                                !input.confirm
                            ) {
                                setError("All fields are ");
                                return;
                            }
                            if (input.password !== input.confirm) {
                                setError("Passwords do not match");
                                return;
                            }
                            setLoading(true);
                            try {
                                const result = await createOrUpdateUser({
                                    email: input.email,
                                    username: input.username,
                                    password: input.password,
                                });
                                setLoading(false);
                                if (result && result.token) {
                                    localStorage.setItem(
                                        "authToken",
                                        result.token
                                    );
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
                                    if (loggedUser.id)
                                        localStorage.setItem(
                                            "userId",
                                            loggedUser.id
                                        );
                                    onLogin(loggedUser);
                                } else {
                                    onLogin(result);
                                }
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || "Error creating user");
                            }
                        } else {
                            if (!input.emailOrUsername || !input.password) {
                                setError("All fields are ");
                                return;
                            }
                            setLoading(true);
                            try {
                                const result = await loginUser({
                                    username: input.emailOrUsername,
                                    password: input.password,
                                });
                                setLoading(false);
                                if (result.token) {
                                    localStorage.setItem(
                                        "authToken",
                                        result.token
                                    );
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
                                    if (loggedUser.id)
                                        localStorage.setItem(
                                            "userId",
                                            loggedUser.id
                                        );
                                    onLogin(loggedUser);
                                } else {
                                    setError("No token received");
                                }
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || "Error logging in");
                            }
                        }
                    }}
                >
                    {isSignUp ? (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
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
                                placeholder="Username"
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
                                placeholder="Password"
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
                                placeholder="Confirm Password"
                                className="border rounded px-3 py-2"
                                value={input.confirm}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        confirm: e.target.value,
                                    }))
                                }
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Email or Username"
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
                                placeholder="Password"
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
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isSignUp ? "Sign Up" : "Log In"}
                    </button>
                </form>
            </div>
            </div>
        </>
    );
}

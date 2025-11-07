import { useState } from "react";
import { createOrUpdateUser, loginUser } from "../services/userService";

export default function LoginModal({
    isOpen,
    onClose,
    onLogin,
    user,
    onLogout,
}) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [input, setInput] = useState({
        emailOrUsername: "",
        password: "",
        username: "",
        email: "",
        confirm: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    if (!isOpen) return null;
    if (user) {
        return (
            <div
                className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50"
                style={{ minWidth: "18rem" }}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative flex flex-col items-center">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        type="button"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Welcome!
                    </h2>
                    <div className="mb-4 text-lg">
                        Username:{" "}
                        <span className="font-bold">{user.username}</span>
                    </div>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={onLogout}
                    >
                        Log out
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div
            className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50"
            style={{ minWidth: "18rem" }}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative">
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
                    <div className="text-red-600 text-sm mb-2 text-center">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="text-blue-600 text-sm mb-2 text-center">
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
                                setError("All fields are required");
                                return;
                            }
                            if (input.password !== input.confirm) {
                                setError("Passwords do not match");
                                return;
                            }
                            setLoading(true);
                            try {
                                const user = await createOrUpdateUser({
                                    email: input.email,
                                    username: input.username,
                                    password: input.password,
                                });
                                setLoading(false);
                                onLogin(user);
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || "Error creating user");
                            }
                        } else {
                            if (!input.emailOrUsername || !input.password) {
                                setError("All fields are required");
                                return;
                            }
                            setLoading(true);
                            try {
                                const user = await loginUser({
                                    emailOrUsername: input.emailOrUsername,
                                    password: input.password,
                                });
                                setLoading(false);
                                onLogin(user);
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
    );
}

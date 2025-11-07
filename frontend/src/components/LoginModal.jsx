import { useState } from "react";

export default function LoginModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    if (!isOpen) return null;
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
                <form className="flex flex-col gap-4">
                    {isSignUp ? (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="border rounded px-3 py-2"
                                required
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Email or Username"
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="border rounded px-3 py-2"
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

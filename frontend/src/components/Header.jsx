import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import { NavLink } from "react-router-dom";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("cw_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (username) => {
        localStorage.setItem("cw_user", JSON.stringify({ username }));
        setUser({ username });
        setShowLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("cw_user");
        setUser(null);
        setShowLogin(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-16 md:h-20">
                    <div className="shrink-0">
                        <img
                            src="bannerCanaryWeather.png"
                            alt="Canary Weather Logo"
                            className="h-8 md:h-10 w-auto"
                        />
                    </div>

                    <ul className="hidden md:flex items-center space-x-8">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-700 hover:text-gray-900 transition-colors"
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/map"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-700 hover:text-gray-900 transition-colors"
                                }
                            >
                                Map
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/POI"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-700 hover:text-gray-900 transition-colors"
                                }
                            >
                                Points of Interest
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/tides"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-700 hover:text-gray-900 transition-colors"
                                }
                            >
                                Tides
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/warnings"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-700 hover:text-gray-900 transition-colors"
                                }
                            >
                                Warnings
                            </NavLink>
                        </li>
                    </ul>

                    <div className="md:block relative flex flex-col items-center">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                user
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            onClick={() => setShowLogin((prev) => !prev)}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {user ? "Log out" : "Log in"}
                        </button>
                        <LoginModal
                            isOpen={showLogin}
                            onClose={() => setShowLogin(false)}
                            onLogin={handleLogin}
                            user={user}
                            onLogout={handleLogout}
                        />
                    </div>

                    <button
                        className="md:hidden text-gray-700 text-2xl p-2"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </nav>

                {isOpen && (
                    <div className="md:hidden pb-4">
                        <ul className="flex flex-col space-y-3">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "block text-gray-900 font-semibold py-2"
                                            : "block text-gray-700 hover:text-gray-900 py-2"
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/map"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "block text-gray-900 font-semibold py-2"
                                            : "block text-gray-700 hover:text-gray-900 py-2"
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    Map
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/POI"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "block text-gray-900 font-semibold py-2"
                                            : "block text-gray-700 hover:text-gray-900 py-2"
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    Points of Interest
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/tides"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "block text-gray-900 font-semibold py-2"
                                            : "block text-gray-700 hover:text-gray-900 py-2"
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    Tides
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/warnings"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "block text-gray-900 font-semibold py-2"
                                            : "block text-gray-700 hover:text-gray-900 py-2"
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    Warnings
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                                    onClick={() =>
                                        setShowLogin((prev) => !prev)
                                    }
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    log in
                                </button>
                                <LoginModal
                                    isOpen={showLogin}
                                    onClose={() => setShowLogin(false)}
                                />
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;

import { useState, useEffect, useRef } from "react";
import LoginModal from "./LoginModal";
import { NavLink } from "react-router-dom";
import { createOrUpdateUser } from "../services/userService";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const storedUser = localStorage.getItem("cw_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userObj) => {
    localStorage.setItem("cw_user", JSON.stringify(userObj));
    setUser(userObj);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cw_user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
    setShowLogin(false);
    window.location.reload();
  };

  const handleImageClick = () => {
    if (user && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    setUploading(true);
    try {
      const updatedUser = await createOrUpdateUser(formData, user.id);
      const newUser = {
        ...user,
        profile_picture_url: updatedUser.profile_picture_url,
      };
      localStorage.setItem("cw_user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error al subir la imagen de perfil");
    } finally {
      setUploading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (user?.profile_picture_url) {
      const baseUrl = API_BASE.replace("/api", "");
      return `${baseUrl}${user.profile_picture_url}`;
    }
    return null;
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
              className="h-16 md:h-20 w-auto"
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
                to="/pois"
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
            {user ? (
              <div className="flex gap-2 items-center">
                <div className="relative group">
                  <button
                    onClick={handleImageClick}
                    disabled={uploading}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-all cursor-pointer"
                    title="Cambiar foto de perfil"
                  >
                    {getProfileImageUrl() ? (
                      <img
                        src={getProfileImageUrl()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <button
                  className="bg-accent-blue-200 text-white px-4 py-2 rounded hover:bg-accent-blue-100 transition-colors"
                  onClick={() => setShowLogin(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                className="bg-brand-primary text-white px-4 py-2 rounded-full hover:bg-accent-blue-200 transition-colors flex items-center gap-2"
                onClick={() => setShowLogin(true)}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Log in</span>
              </button>
            )}
            <LoginModal
              isOpen={showLogin}
              onClose={() => setShowLogin(false)}
              onLogin={handleLogin}
              user={user}
              onLogout={handleLogout}
            />
          </div>

          <button
            className="md:hidden text-neutral-2 text-2xl p-2"
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
                  log in
                </button>
                <LoginModal
                  isOpen={showLogin}
                  onClose={() => setShowLogin(false)}
                  onLogin={handleLogin}
                  user={user}
                  onLogout={handleLogout}
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

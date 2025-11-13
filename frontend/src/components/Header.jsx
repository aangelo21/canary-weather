// Import React hooks and components
import { useState, useEffect, useRef } from "react";
// Import LoginModal component for authentication
import LoginModal from "./LoginModal";
// Import NavLink for navigation with active state styling
import { NavLink } from "react-router-dom";
// Import user service for profile picture updates
import { createOrUpdateUser } from "../services/userService";

// Header component - main navigation bar with authentication and user profile management
function Header() {
  // State for mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);
  // State for showing login modal
  const [showLogin, setShowLogin] = useState(false);
  // State for current user data
  const [user, setUser] = useState(null);
  // State for profile picture upload loading
  const [uploading, setUploading] = useState(false);
  // Ref for hidden file input
  const fileInputRef = useRef(null);
  // API base URL from environment variables
  const API_BASE = import.meta.env.VITE_API_BASE;

  // Effect to load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("cw_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handler for successful login - stores user data and closes modal
  const handleLogin = (userObj) => {
    localStorage.setItem("cw_user", JSON.stringify(userObj));
    setUser(userObj);
    setShowLogin(false);
  };

  // Handler for logout - clears localStorage and reloads page
  const handleLogout = () => {
    localStorage.removeItem("cw_user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
    setShowLogin(false);
    window.location.reload();
  };

  // Handler for profile image click - triggers file input
  const handleImageClick = () => {
    if (user && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for profile image file change - uploads new profile picture
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    setUploading(true);
    try {
      // Upload profile picture via API
      const updatedUser = await createOrUpdateUser(formData, user.id);
      const newUser = {
        ...user,
        profile_picture_url: updatedUser.profile_picture_url,
      };
      // Update localStorage and state with new profile picture URL
      localStorage.setItem("cw_user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error al subir la imagen de perfil");
    } finally {
      setUploading(false);
    }
  };

  // Helper function to construct full profile image URL
  const getProfileImageUrl = () => {
    if (user?.profile_picture_url) {
      const baseUrl = API_BASE.replace("/api", "");
      return `${baseUrl}${user.profile_picture_url}`;
    }
    return null;
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    // Header element with white background and shadow
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation bar */}
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo section */}
          <div className="shrink-0">
            <img
              src="bannerCanaryWeather.png"
              alt="Logo de Canary Weather"
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Desktop navigation menu */}
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
                Inicio
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
                Mapa
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
                Puntos de Interés
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
                Mareas
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
                Advertencias
              </NavLink>
            </li>
          </ul>

          {/* User authentication section */}
          <div className="md:block relative flex flex-col items-center">
            {user ? (
              // Logged in user section with profile picture and buttons
              <div className="flex gap-2 items-center">
                {/* Profile picture upload area */}
                <div className="relative group">
                  <button
                    onClick={handleImageClick}
                    disabled={uploading}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-all cursor-pointer"
                    title="Cambiar foto de perfil"
                  >
                    {getProfileImageUrl() ? (
                      // Display uploaded profile picture
                      <img
                        src={getProfileImageUrl()}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Default user icon
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
                    {/* Loading spinner during upload */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    )}
                  </button>
                  {/* Hidden file input for profile picture selection */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {/* Edit profile button */}
                <button
                  className="bg-accent-blue-200 text-white px-4 py-2 rounded hover:bg-accent-blue-100 transition-colors"
                  onClick={() => setShowLogin(true)}
                >
                  Editar Perfil
                </button>
                {/* Logout button */}
                <button
                  className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              // Login button for unauthenticated users
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
                <span>Iniciar Sesión</span>
              </button>
            )}
            {/* Login modal component */}
            <LoginModal
              isOpen={showLogin}
              onClose={() => setShowLogin(false)}
              onLogin={handleLogin}
              user={user}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile menu toggle button */}
          <button
            className="md:hidden text-neutral-2 text-2xl p-2"
            onClick={toggleMenu}
            aria-label="Alternar menú"
          >
            {isOpen ? (
              // Close icon when menu is open
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
              // Hamburger icon when menu is closed
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

        {/* Mobile navigation menu */}
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
                  Inicio
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
                  Mapa
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
                  Puntos de Interés
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
                  Mareas
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
                  Advertencias
                </NavLink>
              </li>
              <li>
                {/* Mobile login button */}
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
                  iniciar sesión
                </button>
                {/* Mobile login modal */}
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

// Export Header component as default
export default Header;

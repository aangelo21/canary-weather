// Import React hooks and components
import { useState, useEffect, useRef } from "react";
// Import LoginModal component for authentication
import LoginModal from "./LoginModal";
// Import NavLink for navigation with active state styling
import { NavLink } from "react-router-dom";
// Import user service for profile picture updates
import { createOrUpdateUser } from "../services/userService";
// Import alert service for fetching alerts
import { fetchAlerts } from "../services/alertService";
// Import i18n for translations
import { useTranslation } from "react-i18next";

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
  // State for language selector dropdown
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  // State for alerts
  const [alerts, setAlerts] = useState([]);
  // Ref for hidden file input
  const fileInputRef = useRef(null);
  // API base URL from environment variables
  const API_BASE = import.meta.env.VITE_API_BASE;
  // Translation hook
  const { t, i18n } = useTranslation();

  // Effect to load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("cw_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("cw_user");
      }
    }
  }, []);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown]);

  // Effect to fetch alerts on component mount
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    loadAlerts();
  }, []);

  // Handler for successful login - stores user data and closes modal
  const handleLogin = (userObj) => {
    localStorage.setItem("cw_user", JSON.stringify(userObj));
    setUser(userObj);
    setShowLogin(false);
    // Dispatch custom event to notify other components of login
    window.dispatchEvent(new Event('userLoggedIn'));
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
      alert(t('errorUploadProfile'));
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

  // Function to get the highest alert level color
  const getAlertColor = () => {
    if (alerts.length === 0) return 'bg-[#00a91c]'; // No alerts: success green
    const levels = alerts.map(alert => alert.level.toLowerCase());
    if (levels.includes('rojo') || levels.includes('red')) return 'bg-[#b50909]'; // error red
    if (levels.includes('naranja') || levels.includes('orange')) return 'bg-orange-500'; // orange
    if (levels.includes('amarillo') || levels.includes('yellow')) return 'bg-[#e5a000]'; // warning yellow
    return 'bg-[#00a91c]'; // Default to green
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
        <nav className="flex items-center h-16 md:h-20">
          {/* Logo section */}
          <div className="shrink-0">
            <img
              src="bannerCanaryWeather.png"
              alt="Logo de Canary Weather"
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Centered desktop navigation menu */}
          <div className="flex-1 flex justify-center">
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
                  {t('home')}
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
                  {t('map')}
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
                  {t('pointsOfInterest')}
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
                  {t('tides')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/warnings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-700 hover:text-gray-900 transition-colors"}`
                  }
                >
                  <span className={`w-3 h-3 rounded-full ${getAlertColor()}`}></span>
                  {t('warnings')}
                </NavLink>
              </li>
              {/* Language selector dropdown attached to navigation */}
              <li>
                <div className="relative language-dropdown">
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors border border-gray-300"
                  >
                    <span className="text-sm font-medium">
                      {i18n.language === 'en' ? 'EN' : 'ES'}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          i18n.changeLanguage('es');
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg ${
                          i18n.language === 'es' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        🇪🇸 Español
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage('en');
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg ${
                          i18n.language === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        🇺🇸 English
                      </button>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>          {/* User authentication section */}
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
                    title={t('changeProfilePic')}
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
                  {t('editProfile')}
                </button>
                {/* Logout button */}
                <button
                  className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  onClick={handleLogout}
                >
                  {t('logout')}
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
                <span>{t('login')}</span>
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
                  {t('home')}
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
                  {t('map')}
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
                  {t('pointsOfInterest')}
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
                  {t('tides')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/warnings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive
                      ? "block text-gray-900 font-semibold py-2"
                      : "block text-gray-700 hover:text-gray-900 py-2"}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`w-3 h-3 rounded-full ${getAlertColor()}`}></span>
                  {t('warnings')}
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
                  {t('login')}
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
              <li className="border-t border-gray-200 pt-3 mt-3">
                {/* Mobile language selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t('language')}:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => i18n.changeLanguage('es')}
                      className={`px-3 py-1 text-sm rounded ${
                        i18n.language === 'es'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      🇪🇸 ES
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage('en')}
                      className={`px-3 py-1 text-sm rounded ${
                        i18n.language === 'en'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      🇺🇸 EN
                    </button>
                  </div>
                </div>
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

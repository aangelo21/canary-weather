// Import React hooks and components
import { useState, useEffect, useRef } from "react";
// Import LoginModal component for authentication
import LoginModal from "./LoginModal";
// Import NavLink for navigation with active state styling
import { NavLink, useNavigate } from "react-router-dom";
// Import alert service for fetching alerts
import { fetchAlerts } from "../services/alertService";
import { logoutUser } from "../services/userService";
// Import i18n for translations
import { useTranslation } from "react-i18next";
// Import ThemeSwitch for dark mode toggle
import ThemeSwitch from "./ThemeSwitch";

// Header component - main navigation bar with authentication and user profile management
function Header() {
  // State for mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);
  // State for mobile settings dropdown
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  // State for mobile user profile dropdown
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);
  // State for showing login modal
  const [showLogin, setShowLogin] = useState(false);
  // State for current user data
  const [user, setUser] = useState(null);
  // State for language selector dropdown
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  // State for user profile dropdown
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // State for alerts
  const [alerts, setAlerts] = useState([]);
  // Ref for user dropdown
  const userDropdownRef = useRef(null);
  // API base URL from environment variables
  const API_BASE = import.meta.env.VITE_API_BASE;
  // Translation hook
  const { t, i18n } = useTranslation();
  // Navigation hook
  const navigate = useNavigate();

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
      if (showUserDropdown && userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (showMobileSettings && !event.target.closest('.mobile-settings-dropdown')) {
        setShowMobileSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown, showUserDropdown, showMobileSettings]);

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
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("cw_user");
    localStorage.removeItem("userId");
    setUser(null);
    setShowLogin(false);
    setShowUserDropdown(false);
    window.location.reload();
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
        <nav className="flex items-center h-16 md:h-20 relative">
          {/* Logo section */}
          <div className="shrink-0">
            <img
              src="logo.webp"
              alt="Logo de Canary Weather"
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Centered desktop navigation menu */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ul className="flex items-center space-x-4 lg:space-x-8">
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
                  to="/aboutus"
                  className={({ isActive }) =>
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-700 hover:text-gray-900 transition-colors"
                  }
                >
                  {t('aboutUs')}
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
            </ul>
          </div>

          {/* Language selector and user authentication section */}
          <div className="lg:flex hidden items-center gap-3 ml-auto">
            {/* Theme switch for dark mode */}
            <ThemeSwitch />
            
            {/* Language selector dropdown */}
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

            {user ? (
              // Logged in user section with profile picture dropdown
              <div className="relative" ref={userDropdownRef}>
                {/* Profile picture button */}
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-all cursor-pointer"
                  title={user.username || t('userProfile')}
                >
                  {getProfileImageUrl() ? (
                    // Display uploaded profile picture
                    <img
                      src={getProfileImageUrl()}
                      alt={t('profile')}
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
                </button>
                {/* Dropdown menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 rounded-t-lg text-gray-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('editProfile')}
                    </button>
                    {user.is_admin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2 border-t border-gray-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {t('dashboard')}
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 rounded-b-lg text-red-600 flex items-center gap-2 border-t border-gray-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('logout')}
                    </button>
                  </div>
                )}
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
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            {/* Mobile Settings Button */}
            <div className="relative mobile-settings-dropdown">
              <button
                onClick={() => setShowMobileSettings(!showMobileSettings)}
                className="text-neutral-2 text-2xl p-2"
                aria-label="Ajustes"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {showMobileSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">{t('theme')}:</span>
                    <ThemeSwitch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{t('language')}:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          i18n.changeLanguage('en');
                          setShowMobileSettings(false);
                        }}
                        className={`px-3 py-1 text-sm rounded ${
                          i18n.language === 'en'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        🇺🇸 EN
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage('es');
                          setShowMobileSettings(false);
                        }}
                        className={`px-3 py-1 text-sm rounded ${
                          i18n.language === 'es'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        🇪🇸 ES
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              className="text-neutral-2 text-2xl p-2"
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
          </div>
        </nav>

        {/* Mobile navigation menu */}
        {isOpen && (
          <div className="lg:hidden pb-4">
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
                  to="/pois"
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
                  to="/aboutus"
                  className={({ isActive }) =>
                    isActive
                      ? "block text-gray-900 font-semibold py-2"
                      : "block text-gray-700 hover:text-gray-900 py-2"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {t('aboutUs')}
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
                {user ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowMobileUserDropdown(!showMobileUserDropdown)}
                      className="flex items-center gap-2 py-2 w-full text-left"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-600">
                        {getProfileImageUrl() ? (
                          <img
                            src={getProfileImageUrl()}
                            alt={t('profile')}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
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
                      </div>
                      <span className="font-medium text-gray-900">{user.username || t('userProfile')}</span>
                      <svg
                        className={`w-4 h-4 ml-auto transition-transform ${showMobileUserDropdown ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showMobileUserDropdown && (
                      <div className="pl-4 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setShowLogin(true);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {t('editProfile')}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    onClick={() => setShowLogin(true)}
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
                )}
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

import { useState, useEffect, useRef } from 'react';
import LoginModal from '../common/LoginModal';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchAlerts } from '../../services/alertService';
import { logoutUser } from '../../services/userService';
import { useTranslation } from 'react-i18next';
import ThemeSwitch from '../common/ThemeSwitch';

/**
 * Header Component.
 *
 * A sleek, minimalist, and highly responsive navigation header.
 * This design focuses on clarity, typography, and subtle interactions.
 * It uses a full-width sticky layout with a refined backdrop blur.
 *
 * Key Design Features:
 * - **Minimalist Aesthetic**: Clean lines, ample whitespace, and a focus on content.
 * - **Interactive Navigation**: Animated underlines for links and smooth hover states.
 * - **Sticky Positioning**: Stays at the top of the viewport for easy access.
 * - **Refined Dropdowns**: clean, shadow-based dropdown menus for settings and user profile.
 * - **Accessibility**: High contrast text and clear focus states.
 *
 * Functionality:
 * - Manages user authentication state (login/logout).
 * - Displays real-time weather alerts with visual indicators.
 * - Provides internationalization (i18n) and theme switching.
 *
 * @component
 * @returns {JSX.Element} The rendered Header component.
 */
function Header() {
    /**
     * @type {[boolean, Function]} isOpen - State for mobile menu visibility.
     */
    const [isOpen, setIsOpen] = useState(false);

    /**
     * @type {[boolean, Function]} showMobileSettings - State for mobile settings dropdown visibility.
     */
    const [showMobileSettings, setShowMobileSettings] = useState(false);

    /**
     * @type {[boolean, Function]} showMobileUserDropdown - State for mobile user menu visibility.
     */
    const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);

    /**
     * @type {[boolean, Function]} showLogin - State for LoginModal visibility.
     */
    const [showLogin, setShowLogin] = useState(false);

    /**
     * @type {[Object|null, Function]} user - State for the currently logged-in user.
     */
    const [user, setUser] = useState(null);

    /**
     * @type {[boolean, Function]} showLanguageDropdown - State for desktop language dropdown visibility.
     */
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    /**
     * @type {[boolean, Function]} showUserDropdown - State for desktop user profile dropdown visibility.
     */
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    /**
     * @type {[Array<Object>, Function]} alerts - State for active weather alerts.
     */
    const [alerts, setAlerts] = useState([]);

    const userDropdownRef = useRef(null);
    const API_BASE = import.meta.env.VITE_API_BASE;
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    /**
     * Effect hook to initialize user state from local storage on mount.
     */
    useEffect(() => {
        const storedUser = localStorage.getItem('cw_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('cw_user');
            }
        }
    }, []);

    /**
     * Effect hook to handle clicks outside of dropdowns to close them.
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showLanguageDropdown &&
                !event.target.closest('.language-dropdown')
            ) {
                setShowLanguageDropdown(false);
            }
            if (
                showUserDropdown &&
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target)
            ) {
                setShowUserDropdown(false);
            }
            if (
                showMobileSettings &&
                !event.target.closest('.mobile-settings-dropdown')
            ) {
                setShowMobileSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [showLanguageDropdown, showUserDropdown, showMobileSettings]);

    /**
     * Effect hook to fetch active alerts on mount.
     */
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

    /**
     * Handles successful user login.
     * Updates local storage, component state, and dispatches a global event.
     *
     * @param {Object} userObj - The logged-in user object.
     */
    const handleLogin = (userObj) => {
        localStorage.setItem('cw_user', JSON.stringify(userObj));
        setUser(userObj);
        setShowLogin(false);
        window.dispatchEvent(new Event('userLoggedIn'));
    };

    /**
     * Handles user logout.
     * Calls the logout service, clears local storage, and updates component state.
     */
    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout failed', error);
        }
        localStorage.removeItem('cw_user');
        localStorage.removeItem('userId');
        setUser(null);
        setShowLogin(false);
        setShowUserDropdown(false);
        window.location.reload();
    };

    /**
     * Constructs the full URL for the user's profile picture.
     * @returns {string|null} The profile image URL or null.
     */
    const getProfileImageUrl = () => {
        if (user?.profile_picture_url) {
            const baseUrl = API_BASE.replace('/api', '');
            return `${baseUrl}${user.profile_picture_url}`;
        }
        return null;
    };

    /**
     * Determines the color indicator based on the highest alert level.
     * @returns {string} The CSS class for the background color.
     */
    const getAlertColor = () => {
        if (alerts.length === 0) return 'bg-[#00a91c]';
        const levels = alerts.map((alert) => alert.level.toLowerCase());
        if (levels.includes('rojo') || levels.includes('red'))
            return 'bg-[#b50909]';
        if (levels.includes('naranja') || levels.includes('orange'))
            return 'bg-orange-500';
        if (levels.includes('amarillo') || levels.includes('yellow'))
            return 'bg-[#e5a000]';
        return 'bg-[#00a91c]';
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* 
             * Main Header Container
             * Sticky positioning ensures the header is always accessible.
             * Uses a high-contrast background with a subtle border for separation.
             */}
            <header className="relative z-50 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        
                        {/* 
                         * Logo Section 
                         * Clean and simple branding.
                         * Updated text color to match the brand blue from the design reference.
                         * Added gradient text effect as requested.
                         */}
                        <div className="shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                            <img
                                src="logo.webp"
                                alt="Canary Weather Logo"
                                className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight transition-all">
                                Canary Weather
                            </span>
                        </div>

                        {/* 
                         * Desktop Navigation 
                         * Uses an animated underline effect for a modern, interactive feel.
                         * Reordered links: Warnings is now the last item.
                         */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {[
                                { to: '/', label: t('home') },
                                { to: '/map', label: t('map') },
                                { to: '/pois', label: t('pointsOfInterest') },
                                { to: '/aboutus', label: t('aboutUs') },
                                { 
                                    to: '/warnings', 
                                    label: t('warnings'), 
                                    icon: <span className={`w-2 h-2 rounded-full mr-2 ${getAlertColor()} ${['bg-[#b50909]', 'bg-orange-500'].includes(getAlertColor()) ? 'animate-pulse' : ''}`}></span> 
                                }
                            ].map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `relative group flex items-center text-sm font-semibold tracking-wide transition-colors duration-300 ${
                                            isActive
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-neutral-800 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    {link.label}
                                    {/* Animated Underline */}
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* 
                         * Right Side Actions (Desktop) 
                         * Minimalist controls for settings and user profile.
                         */}
                        <div className="hidden lg:flex items-center gap-4">
                            
                            {/* Theme Switcher */}
                            <div className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors">
                                <ThemeSwitch />
                            </div>

                            {/* Divider */}
                            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700"></div>

                            {/* Language Selector */}
                            <div className="relative language-dropdown">
                                <button
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    className="flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <img 
                                        src={i18n.language === 'en' ? 'https://flagcdn.com/w40/gb.png' : 'https://flagcdn.com/w40/es.png'} 
                                        alt={i18n.language === 'en' ? 'English' : 'Español'}
                                        className="w-5 h-5 rounded-full object-cover shadow-sm"
                                    />
                                    <span>{i18n.language === 'en' ? 'EN' : 'ES'}</span>
                                </button>
                                
                                {showLanguageDropdown && (
                                    <div className="absolute right-0 mt-4 w-32 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-700 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                                        {[
                                            { code: 'es', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
                                            { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' }
                                        ].map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    i18n.changeLanguage(lang.code);
                                                    setShowLanguageDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                                                    i18n.language === lang.code
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                                                }`}
                                            >
                                                <img src={lang.flag} alt={lang.label} className="w-4 h-4 rounded-full object-cover" />
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* User Profile / Login Button */}
                            {user ? (
                                <div className="relative ml-2" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center gap-3 focus:outline-none group"
                                    >
                                        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                                            {getProfileImageUrl() ? (
                                                <img src={getProfileImageUrl()} alt={t('profile')} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-bold text-sm">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                    
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => { setShowLogin(true); setShowUserDropdown(false); }}
                                                    className="w-full text-left px-5 py-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700"
                                                >
                                                    <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    {t('editProfile')}
                                                </button>
                                                {user.is_admin && (
                                                    <button
                                                        onClick={() => { navigate('/admin'); setShowUserDropdown(false); }}
                                                        className="w-full text-left px-5 py-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700"
                                                    >
                                                        <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                        {t('dashboard')}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    {t('logout')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    className="ml-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                    onClick={() => setShowLogin(true)}
                                >
                                    {t('login')}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* 
                         * Mobile Controls 
                         * Simplified controls for smaller screens.
                         */}
                        <div className="lg:hidden flex items-center gap-4">
                            
                            {/* Mobile Settings Toggle */}
                            <div className="relative mobile-settings-dropdown">
                                <button
                                    onClick={() => setShowMobileSettings(!showMobileSettings)}
                                    className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                {showMobileSettings && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-100 dark:border-neutral-700 z-50 p-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('theme')}:</span>
                                            <ThemeSwitch />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('language')}:</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { i18n.changeLanguage('en'); setShowMobileSettings(false); }}
                                                    className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded border transition-colors ${i18n.language === 'en' ? 'bg-blue-600 text-white border-transparent shadow-sm' : 'bg-transparent border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400'}`}
                                                >
                                                    <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-3 h-3 rounded-full" />
                                                    EN
                                                </button>
                                                <button
                                                    onClick={() => { i18n.changeLanguage('es'); setShowMobileSettings(false); }}
                                                    className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded border transition-colors ${i18n.language === 'es' ? 'bg-blue-600 text-white border-transparent shadow-sm' : 'bg-transparent border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400'}`}
                                                >
                                                    <img src="https://flagcdn.com/w40/es.png" alt="ES" className="w-3 h-3 rounded-full" />
                                                    ES
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                onClick={toggleMenu}
                            >
                                {isOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 
                     * Mobile Menu Content 
                     * A clean, slide-down menu for mobile devices.
                     */}
                    {isOpen && (
                        <div className="lg:hidden py-4 border-t border-neutral-100 dark:border-neutral-800 animate-in slide-in-from-top-2 fade-in duration-200">
                            <ul className="flex flex-col space-y-1">
                                {[
                                    { to: '/', label: t('home') },
                                    { to: '/map', label: t('map') },
                                    { to: '/pois', label: t('pointsOfInterest') },
                                    { to: '/aboutus', label: t('aboutUs') },
                                    { to: '/warnings', label: t('warnings'), icon: <span className={`w-2 h-2 rounded-full mr-2 ${getAlertColor()}`}></span> }
                                ].map((link) => (
                                    <li key={link.to}>
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                                                }`
                                            }
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                                
                                {/* Mobile User Section */}
                                <li className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                                    {user ? (
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setShowMobileUserDropdown(!showMobileUserDropdown)}
                                                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                                    {getProfileImageUrl() ? (
                                                        <img src={getProfileImageUrl()} alt={t('profile')} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">{user.username?.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user.username}</p>
                                                </div>
                                                <svg className={`w-4 h-4 text-neutral-400 transition-transform ${showMobileUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>

                                            {showMobileUserDropdown && (
                                                <div className="mx-4 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                                                    <button
                                                        onClick={() => { setShowLogin(true); setIsOpen(false); }}
                                                        className="w-full text-left px-5 py-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700"
                                                    >
                                                        <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        {t('editProfile')}
                                                    </button>
                                                    {user.is_admin && (
                                                        <button
                                                            onClick={() => { navigate('/admin'); setIsOpen(false); }}
                                                            className="w-full text-left px-5 py-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700"
                                                        >
                                                            <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                            {t('dashboard')}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                        {t('logout')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="px-4">
                                            <button
                                                className="w-full flex items-center justify-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-4 py-3 rounded-lg font-semibold shadow-sm hover:shadow-lg transition-all"
                                                onClick={() => setShowLogin(true)}
                                            >
                                                {t('login')}
                                            </button>
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
                user={user}
                onLogout={handleLogout}
            />
        </>
    );
}

export default Header;


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import Layout from './layout/Layout';
import '../i18n/index.js';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/index.js';
import { ThemeProvider } from './context/ThemeContext';
import { restoreSession } from './services/userService';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const PointsOfInterest = lazy(() => import('./pages/PointsOfInterest'));
const Map = lazy(() => import('./pages/Map'));
const Warnings = lazy(() => import('./pages/Warnings'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

/**
 * Loading fallback component.
 * Displayed while lazy-loaded components or initial authentication checks are resolving.
 */
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
);

/**
 * Main App Component.
 *
 * The root component of the application. It orchestrates:
 * - **Routing**: Uses `react-router-dom` to define the navigation structure.
 * - **Context Providers**: Wraps the app in `ThemeProvider` (for dark/light mode) and `I18nextProvider` (for translations).
 * - **Session Management**: Checks for an existing user session on mount and attempts to restore it.
 * - **Lazy Loading**: Uses `React.lazy` and `Suspense` to load page components on demand, improving initial load time.
 * - **Layout**: Wraps all routes in a common `Layout` component (Header/Footer).
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
    /**
     * @type {[boolean, Function]} isAuthLoaded - State to track if the initial authentication check is complete.
     */
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    /**
     * Effect hook to initialize authentication.
     * Checks local storage for a user token and verifies the session with the backend.
     */
    useEffect(() => {
        const initAuth = async () => {
            const userStr = localStorage.getItem('cw_user');
            if (userStr) {
                const restored = await restoreSession();
                if (!restored) {
                    // Session expired or invalid, clear local storage
                    localStorage.removeItem('cw_user');
                }
            }
            setIsAuthLoaded(true);
        };
        initAuth();
    }, []);

    if (!isAuthLoaded) {
        return <PageLoader />;
    }

    return (
        <ThemeProvider>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    <ScrollToTop />
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/pois" element={<PointsOfInterest />} />
                                <Route path="/map" element={<Map />} />
                                <Route path="/warnings" element={<Warnings />} />
                                <Route path="/aboutus" element={<AboutUs />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </I18nextProvider>
        </ThemeProvider>
    );
}

export default App;

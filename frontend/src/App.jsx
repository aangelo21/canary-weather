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
import RedirectToApiDocs from './components/RedirectToApiDocs';

const Home = lazy(() => import('./pages/Home'));
const PointsOfInterest = lazy(() => import('./pages/PointsOfInterest'));
const Map = lazy(() => import('./pages/Map'));
const Warnings = lazy(() => import('./pages/Warnings'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
    </div>
);

function App() {
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            const userStr = localStorage.getItem('cw_user');
            if (userStr) {
                const restored = await restoreSession();
                if (!restored) {
                    localStorage.removeItem('cw_user');
                }
            }
            setIsAuthLoaded(true);
        };
        initAuth();

        const REFRESH_INTERVAL = 14 * 60 * 1000;
        const intervalId = setInterval(async () => {
            const userStr = localStorage.getItem('cw_user');
            if (userStr) {
                console.log('Refreshing token...');
                await restoreSession();
            }
        }, REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
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
                            <Route
                                path="/api-docs"
                                element={<RedirectToApiDocs />}
                            />
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/pois"
                                    element={<PointsOfInterest />}
                                />
                                <Route path="/map" element={<Map />} />
                                <Route
                                    path="/warnings"
                                    element={<Warnings />}
                                />
                                <Route path="/aboutus" element={<AboutUs />} />
                                <Route
                                    path="/admin"
                                    element={<AdminDashboard />}
                                />
                                <Route
                                    path="/privacy-policy"
                                    element={<PrivacyPolicy />}
                                />
                                <Route
                                    path="/terms-and-conditions"
                                    element={<TermsAndConditions />}
                                />
                                <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword />}
                                />
                                <Route
                                    path="/reset-password"
                                    element={<ResetPassword />}
                                />
                            </Route>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </I18nextProvider>
        </ThemeProvider>
    );
}

export default App;

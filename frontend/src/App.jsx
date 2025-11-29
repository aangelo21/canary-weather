import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import PointsOfInterest from './pages/PointsOfInterest';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Map from './pages/Map';
import Warnings from './pages/Warnings';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import '../i18n/index.js';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/index.js';
import { ThemeProvider } from './context/ThemeContext';
import { restoreSession } from './services/userService';

/**
 * Main App component.
 * Sets up the application routing, theme provider, and internationalization.
 * Handles session restoration on initial load.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

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
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <ThemeProvider>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/pois" element={<PointsOfInterest />} />
                            <Route path="/map" element={<Map />} />
                            <Route path="/warnings" element={<Warnings />} />
                            <Route path="/aboutus" element={<AboutUs />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </I18nextProvider>
        </ThemeProvider>
    );
}

export default App;

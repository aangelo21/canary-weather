// Import React Router components for client-side routing
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
// Import main application styles
import "./App.css";
// Import page components
import PointsOfInterest from "./pages/PointsOfInterest";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Warnings from "./pages/Warnings";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
// Import i18n for internationalization
import "../i18n/index.js";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/index.js";
// Import ThemeProvider for dark mode
import { ThemeProvider } from "./context/ThemeContext";
import { restoreSession } from "./services/userService";

// Main App component that sets up the application routing structure
function App() {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const userStr = localStorage.getItem("cw_user");
      if (userStr) {
        const restored = await restoreSession();
        if (!restored) {
          // Session expired or invalid, clear local storage
          localStorage.removeItem("cw_user");
        }
      }
      setIsAuthLoaded(true);
    };
    initAuth();
  }, []);

  if (!isAuthLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {/* BrowserRouter enables client-side routing */}
       <BrowserRouter>
          {/* Routes component contains all route definitions */}
         <Routes>
            {/* Layout component wraps all routes for consistent UI structure */}
            <Route element={<Layout />}>
              {/* Home page route */}
              <Route path="/" element={<Home />} />
              {/* Points of Interest page route */}
              <Route path="/pois" element={<PointsOfInterest />} />
              {/* Interactive Map page route */}
              <Route path="/map" element={<Map />} />
              {/* Interactive Map page route */}
              <Route path="/warnings" element={<Warnings />} />
              {/* About Us page route */}
              <Route path="/aboutus" element={<AboutUs />} />
              {/* Admin Dashboard route */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </ThemeProvider>
  );
}

// Export the App component as the default export
export default App;

// Import React Router components for client-side routing
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Import main application styles
import "./App.css";
// Import page components
import PointsOfInterest from "./pages/PointsOfInterest";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Warnings from "./pages/Warnings";
// Import i18n for internationalization
import "../i18n/index.js";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/index.js";
// Import ThemeProvider for dark mode
import { ThemeProvider } from "./context/ThemeContext";

// Main App component that sets up the application routing structure
function App() {
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
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </ThemeProvider>
  );
}

// Export the App component as the default export
export default App;

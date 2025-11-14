// Import React Router components for client-side routing
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Import main application styles
import "./App.css";
// Import page components
import PointsOfInterest from "./Pages/PointsOfInterest";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Map from "./pages/Map";

// Main App component that sets up the application routing structure
function App() {
    return (
        <>
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
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

// Export the App component as the default export
export default App;

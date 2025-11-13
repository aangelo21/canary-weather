// Import React components for rendering
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Import global CSS styles
import "./index.css";
import "./leaflet.css";
// Import the main App component
import App from "./App.jsx";

// Create the root React element and render the App component in StrictMode
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);

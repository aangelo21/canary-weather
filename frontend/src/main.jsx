import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './leaflet.css';
import App from './App.jsx';

/**
 * Entry point of the application.
 * Renders the App component into the root element.
 * Uses StrictMode for highlighting potential problems in an application.
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);

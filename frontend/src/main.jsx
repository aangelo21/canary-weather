import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './leaflet.css';
import App from './App.jsx';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

/**
 * Application Entry Point.
 *
 * This file initializes the React application.
 * It mounts the root `App` component into the DOM element with id 'root'.
 *
 * - **StrictMode**: Wraps the app to activate additional checks and warnings for its descendants.
 * - **Styles**: Imports global CSS (`index.css`) and Leaflet map styles (`leaflet.css`).
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);

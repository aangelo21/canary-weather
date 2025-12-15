// alertService.js - Service functions for alert management API operations

import { apiFetch } from './api';

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Fetches all active weather alerts.
 *
 * @returns {Promise<Array>} A list of alert objects.
 * @throws {Error} If the network request fails.
 */
export async function fetchAlerts() {
    const response = await fetch(`${API_BASE}/alerts`);
    if (!response.ok) throw new Error('Error fetching alerts');
    return response.json();
}

/**
 * Fetches alerts specific to a given location.
 *
 * @param {string} locationId - The ID of the location.
 * @returns {Promise<Array>} A list of alert objects for the location.
 * @throws {Error} If the network request fails.
 */
export async function fetchAlertsByLocation(locationId) {
    const response = await fetch(`${API_BASE}/alerts/location/${locationId}`);
    if (!response.ok) throw new Error('Error fetching alerts by location');
    return response.json();
}

/**
 * Triggers the backend to fetch warnings from the external Meteoalarm API.
 * This is typically an admin-only operation.
 *
 * @returns {Promise<Object>} The response from the backend.
 * @throws {Error} If the operation fails or the user is unauthorized.
 */
export async function fetchWarnings() {
    const response = await apiFetch(`/alerts/fetch`, {
        method: 'POST',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error fetching warnings');
    }
    return response.json();
}



import { apiFetch } from './api';

const API_BASE = import.meta.env.VITE_API_BASE;


export async function fetchAlerts() {
    const response = await fetch(`${API_BASE}/alerts`);
    if (!response.ok) throw new Error('Error fetching alerts');
    return response.json();
}


export async function fetchAlertsByLocation(locationId) {
    const response = await fetch(`${API_BASE}/alerts/location/${locationId}`);
    if (!response.ok) throw new Error('Error fetching alerts by location');
    return response.json();
}


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

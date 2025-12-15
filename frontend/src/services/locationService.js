import { apiFetch } from './api';


export async function fetchLocations() {
    const response = await apiFetch(`/locations`);
    if (!response.ok) throw new Error('Error fetching locations');
    return response.json();
}


export async function fetchLocationById(id) {
    const response = await apiFetch(`/locations/${id}`);
    if (!response.ok) throw new Error('Error fetching location');
    return response.json();
}

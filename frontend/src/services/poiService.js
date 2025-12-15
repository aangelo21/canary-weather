// poiService.js - Service functions for Point of Interest (POI) API operations
// This module provides functions to interact with the POI endpoints of the backend API.
// It handles fetching, creating, updating, and deleting POIs, including image upload functionality.

import { apiFetch } from './api';

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Fetches all Points of Interest (POIs).
 *
 * @returns {Promise<Array>} A list of POI objects.
 * @throws {Error} If the network request fails.
 */
export async function fetchPois() {
    // Make GET request to POIs endpoint
    const response = await apiFetch(`/pois`);
    // Throw error if response is not ok
    if (!response.ok) throw new Error('Error fetching POIs');
    // Return parsed JSON data
    return response.json();
}

/**
 * Fetches personal Points of Interest for the authenticated user.
 * This typically includes POIs created by the user or marked as favorites.
 *
 * @returns {Promise<Array>} A list of personal POI objects.
 * @throws {Error} If the network request fails.
 */
export async function fetchPersonalPois() {
    // Make GET request to personal POIs endpoint (includes both personal and local)
    const response = await apiFetch(`/pois/personal`);
    // Throw error if response is not ok
    if (!response.ok) throw new Error('Error fetching user POIs');
    // Return parsed JSON data
    return response.json();
}

/**
 * Creates a new POI or updates an existing one.
 * Handles both JSON data and multipart/form-data (for image uploads).
 *
 * @param {Object} formData - The POI data (name, description, lat, long, etc.).
 * @param {string|null} editingId - The ID of the POI to update, or null to create a new one.
 * @param {File|null} imageFile - An optional image file to upload.
 * @returns {Promise<Object>} The created or updated POI object.
 * @throws {Error} If the API request fails.
 */
export async function createOrUpdatePoi(formData, editingId, imageFile) {
    // Determine URL and HTTP method based on whether we're editing or creating
    const endpoint = editingId
        ? `/pois/${editingId}` // Update existing POI
        : `/pois`; // Create new POI
    const method = editingId ? 'PUT' : 'POST';

    let body;
    let headers = {};

    if (imageFile) {
        // If an image file is provided, use FormData for multipart upload
        const formDataObj = new FormData();
        // Append image file
        formDataObj.append('poi_image', imageFile);
        // Append text fields
        formDataObj.append('name', formData.name);
        if (formData.description) {
            formDataObj.append('description', formData.description);
        }
        if (formData.latitude) {
            formDataObj.append('latitude', formData.latitude);
        }
        if (formData.longitude) {
            formDataObj.append('longitude', formData.longitude);
        }
        formDataObj.append('is_global', formData.is_global || false);
        // Append type if provided
        if (formData.type) {
            formDataObj.append('type', formData.type);
        }
        // Only append location_id if it has a valid value
        if (formData.location_id && formData.location_id.trim() !== '') {
            formDataObj.append('location_id', formData.location_id);
        }
        body = formDataObj;
        // Don't set Content-Type header - browser will set it with boundary
    } else {
        // If no image, send data as JSON
        const payload = {
            ...formData,
            // Convert latitude/longitude strings to numbers or null
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude
                ? parseFloat(formData.longitude)
                : null,
            location_id: formData.location_id || null,
        };
        body = JSON.stringify(payload);
        headers['Content-Type'] = 'application/json';
    }

    // Make the API request
    const response = await apiFetch(endpoint, {
        method,
        headers,
        body,
    });
    // Handle error responses
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error saving POI');
    }
    // Return success response
    return response.json();
}

/**
 * Deletes a Point of Interest by its ID.
 *
 * @param {string} id - The ID of the POI to delete.
 * @returns {Promise<Object>} A success object or the parsed JSON response.
 * @throws {Error} If the deletion fails.
 */
export async function deletePoi(id) {
    // Make DELETE request to specific POI endpoint
    const response = await apiFetch(`/pois/${id}`, {
        method: 'DELETE',
    });
    // Throw error if response is not ok
    if (!response.ok) throw new Error('Error deleting POI');
    try {
        // Try to parse JSON response
        return await response.json();
    } catch {
        // If no JSON response, return success object
        return { success: true };
    }
}

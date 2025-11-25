// poiService.js - Service functions for Point of Interest (POI) API operations
// This module provides functions to interact with the POI endpoints of the backend API.
// It handles fetching, creating, updating, and deleting POIs, including image upload functionality.

import { apiFetch } from "./api";

const API_BASE = import.meta.env.VITE_API_BASE;

// Function to fetch all Points of Interest from the API (global and local only)
export async function fetchPois() {
  // Make GET request to POIs endpoint
  const response = await apiFetch(`/pois`);
  // Throw error if response is not ok
  if (!response.ok) throw new Error("Error fetching POIs");
  // Return parsed JSON data
  return response.json();
}

// Function to fetch only personal and local POIs for the authenticated user
export async function fetchPersonalPois() {
  // Make GET request to personal POIs endpoint (includes both personal and local)
  const response = await apiFetch(`/pois/personal`);
  // Throw error if response is not ok
  if (!response.ok) throw new Error("Error fetching user POIs");
  // Return parsed JSON data
  return response.json();
}

// Function to create a new POI or update an existing one
// Supports both JSON data and file uploads for images
export async function createOrUpdatePoi(formData, editingId, imageFile) {
  // Determine URL and HTTP method based on whether we're editing or creating
  const endpoint = editingId
    ? `/pois/${editingId}` // Update existing POI
    : `/pois`; // Create new POI
  const method = editingId ? "PUT" : "POST";

  let body;
  let headers = {};

  if (imageFile) {
    // If an image file is provided, use FormData for multipart upload
    const formDataObj = new FormData();
    // Append image file
    formDataObj.append("poi_image", imageFile);
    // Append text fields
    formDataObj.append("name", formData.name);
    if (formData.description) {
      formDataObj.append("description", formData.description);
    }
    if (formData.latitude) {
      formDataObj.append("latitude", formData.latitude);
    }
    if (formData.longitude) {
      formDataObj.append("longitude", formData.longitude);
    }
    formDataObj.append("is_global", formData.is_global || false);
    // Append type if provided
    if (formData.type) {
      formDataObj.append("type", formData.type);
    }
    // Only append location_id if it has a valid value
    if (formData.location_id && formData.location_id.trim() !== "") {
      formDataObj.append("location_id", formData.location_id);
    }
    body = formDataObj;
    // Don't set Content-Type header - browser will set it with boundary
  } else {
    // If no image, send data as JSON
    const payload = {
      ...formData,
      // Convert latitude/longitude strings to numbers or null
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      location_id: formData.location_id || null,
    };
    body = JSON.stringify(payload);
    headers["Content-Type"] = "application/json";
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
    throw new Error(errorData.error || "Error saving POI");
  }
  // Return success response
  return response.json();
}

// Function to delete a POI by ID
export async function deletePoi(id) {
  // Make DELETE request to specific POI endpoint
  const response = await apiFetch(`/pois/${id}`, {
    method: "DELETE",
  });
  // Throw error if response is not ok
  if (!response.ok) throw new Error("Error deleting POI");
  try {
    // Try to parse JSON response
    return await response.json();
  } catch {
    // If no JSON response, return success object
    return { success: true };
  }
}

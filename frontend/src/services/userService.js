// userService.js - Service functions for user authentication and management API operations
// This module provides functions to interact with user-related endpoints of the backend API.
// It handles login, user profile management, user creation/updating, and deletion.

import { apiFetch, setAccessToken } from "./api";

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Authenticates a user with username and password.
 * 
 * @param {Object} credentials - The user credentials.
 * @param {string} credentials.username - The username.
 * @param {string} credentials.password - The password.
 * @returns {Promise<Object>} The user data and access token.
 * @throws {Error} If authentication fails.
 */
export async function loginUser({ username, password }) {
  // Make POST request to login endpoint with JSON body
  const response = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error logging in");
  }
  
  const data = await response.json();
  if (data.token) {
    setAccessToken(data.token);
  }
  return data;
}

/**
 * Logs out the current user.
 * Clears the session cookie and the local access token.
 * 
 * @returns {Promise<Object>} The logout response.
 * @throws {Error} If the logout request fails.
 */
export async function logoutUser() {
  const response = await fetch(`${API_BASE}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error logging out");
  }
  setAccessToken(null);
  return response.json();
}

/**
 * Attempts to restore the user session by refreshing the access token.
 * Uses the HTTP-only session cookie to request a new JWT.
 * 
 * @returns {Promise<boolean>} True if session restored successfully, false otherwise.
 */
export async function restoreSession() {
  try {
    const response = await fetch(`${API_BASE}/users/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        setAccessToken(data.token);
        return true;
      }
    }
  } catch (error) {
    console.error("Error restoring session:", error);
  }
  return false;
}

/**
 * Retrieves the profile of the currently authenticated user.
 * 
 * @returns {Promise<Object>} The user profile data.
 * @throws {Error} If the request fails.
 */
export async function getCurrentUser() {
  // Make GET request to user profile endpoint with credentials
  const response = await apiFetch(`/users/me`);
  // Handle error responses
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Error fetching current user");
  }
  // Return user profile data
  return response.json();
}

/**
 * Fetches all users (Admin only).
 * 
 * @returns {Promise<Array>} A list of all users.
 * @throws {Error} If the request fails.
 */
export async function fetchUsers() {
  // Make GET request to users endpoint
  const response = await apiFetch(`/users`);
  if (!response.ok) throw new Error("Error fetching users");
  // Return array of users
  return response.json();
}

/**
 * Creates a new user or updates an existing one.
 * Supports both JSON data and FormData (for profile pictures).
 * 
 * @param {Object|FormData} formData - The user data.
 * @param {string|null} editingId - The ID of the user to update, or null to create.
 * @returns {Promise<Object>} The created or updated user object.
 * @throws {Error} If the request fails.
 */
export async function createOrUpdateUser(formData, editingId) {
  // Determine URL and method based on create vs update operation
  const endpoint = editingId
    ? `/users/${editingId}` // Update existing user
    : `/users`; // Create new user
  const method = editingId ? "PUT" : "POST";
  const headers = {};

  let body;
  if (formData instanceof FormData) {
    // If FormData (with profile picture), use as-is
    body = formData;
  } else {
    // If plain object, send as JSON
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(formData);
  }

  // Make the API request
  let response;
  if (editingId) {
    // Update requires auth
    response = await apiFetch(endpoint, {
      method,
      headers,
      body,
    });
  } else {
    // Create (Registration) is public
    response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    });
  }

  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error saving user");
  }
  
  const data = await response.json();
  if (data.token) {
    setAccessToken(data.token);
  }
  
  // Return success response
  return data;
}

/**
 * Deletes a user account.
 * 
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Object>} A success object or the parsed JSON response.
 * @throws {Error} If the deletion fails.
 */
export async function deleteUser(id) {
  // Make DELETE request to specific user endpoint
  const response = await apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error deleting user");
  }
  // Return success response (204 No Content or JSON)
  return response.status === 204 ? { success: true } : response.json();
}

/**
 * Fetches all available municipalities.
 * Used for populating location selection lists.
 * 
 * @returns {Promise<Array>} A list of municipality objects.
 * @throws {Error} If the request fails.
 */
export async function fetchMunicipalities() {
  // Make GET request to municipalities endpoint
  const response = await fetch(`${API_BASE}/users/municipalities`);
  if (!response.ok) throw new Error("Error fetching municipalities");
  // Return array of municipalities
  return response.json();
}

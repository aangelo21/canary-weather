// userService.js - Service functions for user authentication and management API operations
// This module provides functions to interact with user-related endpoints of the backend API.
// It handles login, user profile management, user creation/updating, and deletion.

const API_BASE = import.meta.env.VITE_API_BASE;

// Function to authenticate a user with username/email and password
export async function loginUser({ username, password }) {
    // Encode credentials in Base64 for Basic Authentication
    const credentials = btoa(`${username}:${password}`);
    // Make POST request to login endpoint with Basic Auth header
    const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
        },
    });
    // Handle error responses
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error logging in");
    }
    // Return user data and token
    return response.json();
}

// Function to get the current authenticated user's profile
export async function getCurrentUser() {
    // Get JWT token from localStorage
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");
    // Make GET request to user profile endpoint with Bearer token
    const response = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    // Handle error responses
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error fetching current user");
    }
    // Return user profile data
    return response.json();
}

// Function to fetch all users (admin functionality)
export async function fetchUsers() {
    // Make GET request to users endpoint
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Error fetching users");
    // Return array of users
    return response.json();
}

// Function to create a new user or update an existing one
// Supports both JSON data and FormData for profile picture uploads
export async function createOrUpdateUser(formData, editingId) {
    // Determine URL and method based on create vs update operation
    const url = editingId
        ? `${API_BASE}/users/${editingId}`  // Update existing user
        : `${API_BASE}/users`;              // Create new user
    const method = editingId ? "PUT" : "POST";
    const headers = {};

    // Add authorization header for updates (requires authentication)
    if (editingId) {
        const token = localStorage.getItem("authToken");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

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
    const response = await fetch(url, {
        method,
        headers,
        body,
    });
    // Handle error responses
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving user");
    }
    // Return success response
    return response.json();
}

// Function to delete a user account
export async function deleteUser(id) {
    // Get auth token for authorization
    const token = localStorage.getItem("authToken");
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    // Make DELETE request to specific user endpoint
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers,
    });
    // Handle error responses
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting user");
    }
    // Return success response (204 No Content or JSON)
    return response.status === 204 ? { success: true } : response.json();
}

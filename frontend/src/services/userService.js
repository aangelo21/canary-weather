// userService.js - Service functions for user authentication and management API operations
// This module provides functions to interact with user-related endpoints of the backend API.
// It handles login, user profile management, user creation/updating, and deletion.

const API_BASE = import.meta.env.VITE_API_BASE;

// Function to authenticate a user with username/email and password
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
  // Return user data
  return response.json();
}

// Function to logout the user
export async function logoutUser() {
  const response = await fetch(`${API_BASE}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error logging out");
  }
  return response.json();
}

// Function to get the current authenticated user's profile
export async function getCurrentUser() {
  // Make GET request to user profile endpoint with credentials
  const response = await fetch(`${API_BASE}/users/me`, {
    credentials: "include",
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
    ? `${API_BASE}/users/${editingId}` // Update existing user
    : `${API_BASE}/users`; // Create new user
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
  const response = await fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
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
  // Make DELETE request to specific user endpoint
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error deleting user");
  }
  // Return success response (204 No Content or JSON)
  return response.status === 204 ? { success: true } : response.json();
}

// Function to fetch all available municipalities
export async function fetchMunicipalities() {
  // Make GET request to municipalities endpoint
  const response = await fetch(`${API_BASE}/users/municipalities`);
  if (!response.ok) throw new Error("Error fetching municipalities");
  // Return array of municipalities
  return response.json();
}

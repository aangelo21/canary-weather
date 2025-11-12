export async function loginUser({ username, password }) {
    const credentials = btoa(`${username}:${password}`);
    const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error logging in");
    }
    return response.json();
}
const API_BASE = import.meta.env.VITE_API_BASE;

export async function getCurrentUser() {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");
    const response = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error fetching current user");
    }
    return response.json();
}

export async function fetchUsers() {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Error fetching users");
    return response.json();
}

export async function createOrUpdateUser(formData, editingId) {
    const url = editingId
        ? `${API_BASE}/users/${editingId}`
        : `${API_BASE}/users`;
    const method = editingId ? "PUT" : "POST";
    const headers = { "Content-Type": "application/json" };
    if (editingId) {
        const token = localStorage.getItem("authToken");
        if (token) headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving user");
    }
    return response.json();
}

export async function deleteUser(id) {
    const token = localStorage.getItem("authToken");
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting user");
    }
    return response.status === 204 ? { success: true } : response.json();
}

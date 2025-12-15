



import { apiFetch, setAccessToken } from './api';

const API_BASE = import.meta.env.VITE_API_BASE;


export async function loginUser({ username, password }) {
    
    const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    });
    
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error logging in');
        } else {
            const text = await response.text();
            console.error('Non-JSON error response:', text);
            throw new Error(
                `Server error: ${response.status} ${response.statusText}`,
            );
        }
    }

    const data = await response.json();
    if (data.token) {
        setAccessToken(data.token);
    }
    return data;
}


export async function logoutUser() {
    const response = await fetch(`${API_BASE}/users/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Error logging out');
    }
    setAccessToken(null);
    return response.json();
}


export async function restoreSession() {
    try {
        const response = await fetch(`${API_BASE}/users/refresh-token`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                setAccessToken(data.token);
                return true;
            }
        }
    } catch (error) {
        console.error('Error restoring session:', error);
    }
    return false;
}


export async function getCurrentUser() {
    
    const response = await apiFetch(`/users/me`);
    
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error fetching current user');
    }
    
    return response.json();
}


export async function fetchUsers() {
    
    const response = await apiFetch(`/users`);
    if (!response.ok) throw new Error('Error fetching users');
    
    return response.json();
}


export async function createOrUpdateUser(formData, editingId) {
    
    const endpoint = editingId
        ? `/users/${editingId}` 
        : `/users`; 
    const method = editingId ? 'PUT' : 'POST';
    const headers = {};

    let body;
    if (formData instanceof FormData) {
        
        body = formData;
    } else {
        
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(formData);
    }

    
    let response;
    if (editingId) {
        
        response = await apiFetch(endpoint, {
            method,
            headers,
            body,
        });
    } else {
        
        response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body,
        });
    }

    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error saving user');
    }

    const data = await response.json();
    if (data.token) {
        setAccessToken(data.token);
    }

    
    return data;
}


export async function deleteUser(id) {
    
    const response = await apiFetch(`/users/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting user');
    }
    
    return response.status === 204 ? { success: true } : response.json();
}


export async function fetchMunicipalities() {
    
    const response = await fetch(`${API_BASE}/users/municipalities`);
    if (!response.ok) throw new Error('Error fetching municipalities');
    
    return response.json();
}

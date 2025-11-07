const API_BASE = import.meta.env.VITE_API_BASE;

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
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving user");
    }
    return response.json();
}

export async function deleteUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error deleting user");
    return response.json();
}

// src/services/poiService.js

const API_BASE = "http://144.126.230.64:85/api";

export async function fetchPois() {
    const response = await fetch(`${API_BASE}/pois`);
    if (!response.ok) throw new Error("Error fetching POIs");
    return response.json();
}

export async function createOrUpdatePoi(formData, editingId) {
    const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        location_id: formData.location_id || null,
    };
    const url = editingId
        ? `${API_BASE}/pois/${editingId}`
        : `${API_BASE}/pois`;
    const method = editingId ? "PUT" : "POST";
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving POI");
    }
    return response.json();
}

export async function deletePoi(id) {
    const response = await fetch(`${API_BASE}/pois/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error deleting POI");
    return response.json();
}

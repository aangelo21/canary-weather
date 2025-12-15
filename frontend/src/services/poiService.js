



import { apiFetch } from './api';

const API_BASE = import.meta.env.VITE_API_BASE;


export async function fetchPois() {
    
    const response = await apiFetch(`/pois`);
    
    if (!response.ok) throw new Error('Error fetching POIs');
    
    return response.json();
}


export async function fetchPersonalPois() {
    
    const response = await apiFetch(`/pois/personal`);
    
    if (!response.ok) throw new Error('Error fetching user POIs');
    
    return response.json();
}


export async function createOrUpdatePoi(formData, editingId, imageFile) {
    
    const endpoint = editingId
        ? `/pois/${editingId}` 
        : `/pois`; 
    const method = editingId ? 'PUT' : 'POST';

    let body;
    let headers = {};

    if (imageFile) {
        
        const formDataObj = new FormData();
        
        formDataObj.append('poi_image', imageFile);
        
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
        
        if (formData.type) {
            formDataObj.append('type', formData.type);
        }
        
        if (formData.location_id && formData.location_id.trim() !== '') {
            formDataObj.append('location_id', formData.location_id);
        }
        body = formDataObj;
        
    } else {
        
        const payload = {
            ...formData,
            
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude
                ? parseFloat(formData.longitude)
                : null,
            location_id: formData.location_id || null,
        };
        body = JSON.stringify(payload);
        headers['Content-Type'] = 'application/json';
    }

    
    const response = await apiFetch(endpoint, {
        method,
        headers,
        body,
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error saving POI');
    }
    
    return response.json();
}


export async function deletePoi(id) {
    
    const response = await apiFetch(`/pois/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Error deleting POI');
    try {
        
        return await response.json();
    } catch {
        
        return { success: true };
    }
}

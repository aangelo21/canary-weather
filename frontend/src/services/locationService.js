import { apiFetch } from "./api";

/**
 * Fetches all locations (municipalities).
 * 
 * @returns {Promise<Array>} A list of location objects.
 * @throws {Error} If the network request fails.
 */
export async function fetchLocations() {
  const response = await apiFetch(`/locations`);
  if (!response.ok) throw new Error("Error fetching locations");
  return response.json();
}

/**
 * Fetches a specific location by ID.
 * 
 * @param {string} id - The ID of the location.
 * @returns {Promise<Object>} The location object.
 * @throws {Error} If the network request fails.
 */
export async function fetchLocationById(id) {
  const response = await apiFetch(`/locations/${id}`);
  if (!response.ok) throw new Error("Error fetching location");
  return response.json();
}

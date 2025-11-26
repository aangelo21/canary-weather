// alertService.js - Service functions for alert management API operations

import { apiFetch } from "./api";

const API_BASE = import.meta.env.VITE_API_BASE;

// Function to fetch all alerts
export async function fetchAlerts() {
  const response = await fetch(`${API_BASE}/alerts`);
  if (!response.ok) throw new Error("Error fetching alerts");
  return response.json();
}

// Function to fetch alerts by location
export async function fetchAlertsByLocation(locationId) {
  const response = await fetch(`${API_BASE}/alerts/location/${locationId}`);
  if (!response.ok) throw new Error("Error fetching alerts by location");
  return response.json();
}

// Function to fetch warnings from external source (admin function)
export async function fetchWarnings() {
  const response = await apiFetch(`/alerts/fetch`, {
    method: "POST",
  });
  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error fetching warnings");
  }
  return response.json();
}
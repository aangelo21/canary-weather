// PointsOfInterest.jsx - Points of Interest management page component
// This component provides a complete interface for managing Points of Interest (POIs).
// It displays POIs in a grid, allows creating/editing/deleting POIs, handles image uploads,
// and fetches weather data for each POI location. Used as a page in the application.

import { useState, useEffect } from "react";
import {
  fetchPois as fetchPoisService,
  createOrUpdatePoi,
  deletePoi as deletePoiService,
} from "../services/poiService";
import POIForm from "./POIForm";
import POICard from "./POICard";

// PointsOfInterest component - Main POI management interface
export default function PointsOfInterest() {
  // State for storing all POIs
  const [pois, setPois] = useState([]);
  // State for weather data associated with each POI
  const [weatherData, setWeatherData] = useState({});
  // State for form data when creating/editing POIs
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    description: "",
    is_global: false,
    location_id: "",
  });
  // State to control form visibility
  const [showEditForm, setShowEditForm] = useState(false);
  // State to track which POI is being edited (null for new POI)
  const [editingId, setEditingId] = useState(null);
  // State for loading indicators
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState("");
  // State for selected image file
  const [selectedImage, setSelectedImage] = useState(null);
  // State for image preview URL
  const [imagePreview, setImagePreview] = useState(null);

  // Function to fetch all POIs from the API
  const fetchPois = async () => {
    try {
      setLoading(true);
      const data = await fetchPoisService();
      setPois(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission for creating/updating POIs
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Call API to create or update POI with optional image
      await createOrUpdatePoi(formData, editingId, selectedImage);
      // Reset form and hide it
      resetForm();
      setShowEditForm(false);
      setEditingId(null);
      // Refresh POI list
      fetchPois();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle POI deletion
  const handleDelete = async (id) => {
    // Show confirmation dialog
    if (!confirm("¿Estás seguro de eliminar este POI?")) return;
    try {
      setLoading(true);
      await deletePoiService(id);
      // Refresh POI list after deletion
      fetchPois();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing a POI - populates form with POI data
  const handleEdit = (poi) => {
    setFormData({
      name: poi.name,
      latitude: poi.latitude?.toString() || "",
      longitude: poi.longitude?.toString() || "",
      description: poi.description || "",
      is_global: poi.is_global,
      location_id: poi.location_id || "",
    });
    setEditingId(poi.id);
    setShowEditForm(true);
    // Set up image preview for existing POI image
    if (poi.image_url) {
      const API_BASE = import.meta.env.VITE_API_BASE;
      const baseUrl = API_BASE.replace("/api", "");
      setImagePreview(`${baseUrl}${poi.image_url}`);
    } else {
      setImagePreview(null);
    }
    setSelectedImage(null);
  };

  // Function to reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      latitude: "",
      longitude: "",
      description: "",
      is_global: false,
      location_id: "",
    });
    setEditingId(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Function to handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // useEffect hook - Load POIs on component mount
  useEffect(() => {
    fetchPois();
  }, []);

  // useEffect hook - Fetch weather data for all POIs when POI list changes
  useEffect(() => {
    async function fetchWeatherForPois() {
      // Create array of promises to fetch weather for each POI
      const entries = await Promise.all(
        pois.map(async (poi) => {
          // Skip POIs without coordinates
          if (!poi.latitude || !poi.longitude) return [poi.id, null];
          try {
            // Get OpenWeatherMap API key
            const OPENWEATHER_API_KEY = import.meta.env
              .VITE_OPENWEATHER_API_KEY;
            // Fetch weather data for POI coordinates
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${poi.latitude}&lon=${poi.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
            );
            const data = await res.json();
            // Return weather data for this POI
            return [
              poi.id,
              {
                temp: data.main?.temp ?? null,
                description: data.weather?.[0]?.description ?? "",
              },
            ];
          } catch {
            // Return null if weather fetch fails
            return [poi.id, null];
          }
        })
      );
      // Convert array of entries to object
      setWeatherData(Object.fromEntries(entries));
    }
    // Only fetch weather if there are POIs
    if (pois.length > 0) {
      fetchWeatherForPois();
    }
  }, [pois]);

  // Return the JSX structure
  return (
    // Main container with gray background and padding
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section with title and POI count */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-[#0f6fb9]">
            Points of Interest
          </h1>
          <div className="text-sm text-gray-600">{pois.length} puntos</div>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-[#fff1f0] border border-[#ffd6d6] text-[#c53030]">
            {error}
          </div>
        )}

        {/* Conditional form display */}
        {showEditForm && (
          <POIForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={() => {
              setShowEditForm(false);
              setEditingId(null);
            }}
            onImageChange={handleImageChange}
            imagePreview={imagePreview}
          />
        )}

        {/* POI cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pois.length === 0 ? (
            // Empty state message
            <div className="col-span-full text-center text-gray-500">
              No hay puntos de interés registrados
            </div>
          ) : (
            // Render POI cards
            pois.map((poi) => (
              <POICard
                key={poi.id}
                poi={poi}
                weather={weatherData[poi.id]}
                onEdit={() => handleEdit(poi)}
                onDelete={() => handleDelete(poi.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

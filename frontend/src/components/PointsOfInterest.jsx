// PointsOfInterest.jsx - Points of Interest management page component
// This component provides a complete interface for managing Points of Interest (POIs).
// It displays POIs in a grid, allows creating/editing/deleting POIs, handles image uploads,
// and fetches weather data for each POI location. Used as a page in the application.

import { useState, useEffect } from "react";
import {
  fetchPois as fetchPoisService,
  fetchPersonalPois,
  createOrUpdatePoi,
  deletePoi as deletePoiService,
} from "../services/poiService";
import POIForm from "./POIForm";
import POICard from "./POICard";
import { useTranslation } from "react-i18next";

// PointsOfInterest component - Main POI management interface
export default function PointsOfInterest() {
    const { t } = useTranslation();
    // Check if user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State for storing all POIs
    const [pois, setPois] = useState([]);
    // State for filtered POIs based on selected filter
    const [filteredPois, setFilteredPois] = useState([]);
    // State for current filter selection
    const [filter, setFilter] = useState('all'); // 'all', 'global', 'local', 'personal'
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

  // Function to fetch personal POIs from the API
  const fetchPersonalPoisData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return [];
      return await fetchPersonalPois();
    } catch (err) {
      console.error("Error fetching personal POIs:", err);
      return [];
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
        if (!confirm(t('confirmDelete'))) return;
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

  // useEffect hook - Load POIs on component mount and check authentication
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    fetchPois();
    
    // Listen for login events to refresh POIs and authentication state
    const handleUserLogin = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
      fetchPois();
      // Reset filter to 'all' to show newly available POIs
      setFilter('all');
    };
    
    // Listen for POI created events to refresh the list
    const handlePoiCreated = () => {
      fetchPois();
      // Trigger filter reapplication to include new POIs
      applyFilter();
    };
    
    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('poiCreated', handlePoiCreated);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('poiCreated', handlePoiCreated);
    };
  }, []);

  // useEffect hook - Apply filter when POIs or filter changes
  useEffect(() => {
    applyFilter();
  }, [pois, filter]);

  // Function to apply the selected filter
  const applyFilter = async () => {
    if (filter === 'all') {
      // Show all POIs (global + user's personal and local)
      const userPois = await fetchPersonalPoisData();
      setFilteredPois([...pois, ...userPois]);
    } else if (filter === 'global') {
      setFilteredPois(pois.filter(poi => poi.type === 'global'));
    } else if (filter === 'local') {
      // Fetch and show only user's local POIs
      const userPois = await fetchPersonalPoisData();
      setFilteredPois(userPois.filter(poi => poi.type === 'local'));
    } else if (filter === 'personal') {
      // Fetch and show only user's personal POIs (municipalities)
      const userPois = await fetchPersonalPoisData();
      setFilteredPois(userPois.filter(poi => poi.type === 'personal'));
    }
  };

  // useEffect hook - Fetch weather data for filtered POIs
  useEffect(() => {
    async function fetchWeatherForPois() {
      // Create array of promises to fetch weather for each filtered POI
      const entries = await Promise.all(
        filteredPois.map(async (poi) => {
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
                humidity: data.main?.humidity ?? null,
                pressure: data.main?.pressure ?? null,
                wind: data.wind?.speed ?? null,
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
    // Only fetch weather if there are filtered POIs
    if (filteredPois.length > 0) {
      fetchWeatherForPois();
    }
  }, [filteredPois]);

    // Return the JSX structure
    return (
        // Main container with gray background and padding
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header section with title and POI count */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0f6fb9]">
                        {t('pointsOfInterest')}
                    </h1>
                    <div className="text-sm text-gray-600">
                        {pois.length} {t('points')}
                    </div>
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

                {/* Filter buttons */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-[#0f6fb9] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {(t('all') || 'Todos').toUpperCase()}
                    </button>
                    <button
                        onClick={() => setFilter('global')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filter === 'global'
                                ? 'bg-[#0f6fb9] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {(t('global') || 'Global').toUpperCase()}
                    </button>
                    {/* Only show Local filter if user is authenticated */}
                    {isAuthenticated && (
                        <button
                            onClick={() => setFilter('local')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'local'
                                    ? 'bg-[#0f6fb9] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {(t('local') || 'Local').toUpperCase()}
                        </button>
                    )}
                    {/* Only show Personal filter if user is authenticated */}
                    {isAuthenticated && (
                        <button
                            onClick={() => setFilter('personal')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'personal'
                                    ? 'bg-[#0f6fb9] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {(t('personal') || 'Personal').toUpperCase()}
                        </button>
                    )}
                </div>

                {/* POI cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPois.length === 0 ? (
                        // Empty state message
                        <div className="col-span-full text-center text-gray-500">
                            {t('noPois')}
                        </div>
                    ) : (
                        // Render POI cards
                        filteredPois.map((poi) => (
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
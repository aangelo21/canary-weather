// WeatherPopup.jsx - Weather information popup component for Leaflet map
// This component displays weather data in a popup when a user clicks on the map.
// It shows temperature, humidity, pressure, wind, and provides a button to save
// the clicked location as a Point of Interest (POI).

import React, { useEffect, useRef, useState } from "react";
import { Popup } from "react-leaflet";
import { createOrUpdatePoi } from "../services/poiService";

// WeatherPopup component - Displays weather info and POI creation option
// Used by InteractiveMap component when user clicks on map locations
function WeatherPopup({ position, weather, markerRef }) {
  // Ref for the popup element
  const popupRef = useRef(null);
  // State to track if POI has been saved
  const [saved, setSaved] = useState(false);
  // State for save operation loading
  const [saving, setSaving] = useState(false);

  // useEffect hook - Ensures popup opens when data is available
  useEffect(() => {
    if (popupRef.current && markerRef?.current) {
      markerRef.current.openPopup();
    }
  }, [position, weather, markerRef]);

  // Early return if required props are missing
  if (!position || !weather) return null;

  // Function to save the clicked location as a POI
  const handleSavePoi = async () => {
    setSaving(true);
    try {
      // Create POI with coordinates as name and basic data
      await createOrUpdatePoi({
        name: `POI ${position[0].toFixed(4)},${position[1].toFixed(4)}`,
        latitude: position[0],
        longitude: position[1],
        description: "",
        is_global: false, // Local POI by default
      });
      // Mark as saved to update UI
      setSaved(true);
    } catch {
      // Optional error handling - could show error message
    }
    setSaving(false);
  };

  // Return the Popup JSX structure
  return (
    // Leaflet Popup component positioned at clicked coordinates
    <Popup position={position} ref={popupRef}>
      {/* Popup content container */}
      <div className="p-2 text-center">
        {/* Main temperature display */}
        <span className="text-lg font-semibold">{weather.temp}°C</span>

        {/* Weather details section */}
        <div className="text-sm mt-1">
          <div>Condición: {weather.description}</div>
          <div>Humedad: {weather.humidity}%</div>
          <div>Presión: {weather.pressure} hPa</div>
          <div>Viento: {weather.wind} m/s</div>
        </div>

        {/* Save as POI button */}
        <button
          className="mt-2 px-3 py-1 bg-accent-blue-200 text-white rounded hover:bg-accent-blue-100 disabled:opacity-50"
          onClick={handleSavePoi}
          disabled={saved || saving}
        >
          {saving ? "Guardando..." : saved ? "Guardado" : "Guardar como POI"}
        </button>

        {/* Success message when POI is saved */}
        {saved && (
          <div className="mt-2 text-green-600 text-sm">¡POI guardado!</div>
        )}
      </div>
    </Popup>
  );
}

export default WeatherPopup;

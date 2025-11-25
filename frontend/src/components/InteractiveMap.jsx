// InteractiveMap.jsx - Interactive map component using Leaflet
// This component renders an interactive map of the Canary Islands where users can click
// to get weather information for any location. It integrates with OpenWeatherMap API
// to fetch real-time weather data and displays it in a popup on the map.

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import WeatherPopup from "./WeatherPopup";
import { useTheme } from "../context/ThemeContext";

// InteractiveMap component - Main map interface for weather exploration
// Allows users to click anywhere on the map to see current weather conditions
// Restricted to Canary Islands bounds with satellite imagery
function InteractiveMap() {
  const { isDarkMode } = useTheme();
  // State to store the coordinates where user clicked on the map
  const [clickedPos, setClickedPos] = useState(null);
  // State to store weather data fetched from API
  const [weather, setWeather] = useState(null);
  // Ref to control the marker popup programmatically
  const markerRef = useRef(null);

  // MapClickHandler component - Handles map click events
  // This is a custom component that uses Leaflet's useMapEvents hook
  // to listen for click events and fetch weather data asynchronously
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        // Extract latitude and longitude from click event
        const { lat, lng } = e.latlng;
        // Update clicked position state
        setClickedPos([lat, lng]);
        // Reset weather data while fetching new data
        setWeather(null);
        try {
          // Get OpenWeatherMap API key from environment variables
          const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
          // Fetch weather data from OpenWeatherMap API
          // Uses metric units for temperature
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          // Parse JSON response
          const data = await res.json();
          // Extract relevant weather information
          // Uses optional chaining and nullish coalescing for safe property access
          setWeather({
            temp: data.main?.temp ?? null, // Temperature in Celsius
            humidity: data.main?.humidity ?? null, // Humidity percentage
            pressure: data.main?.pressure ?? null, // Atmospheric pressure
            wind: data.wind?.speed ?? null, // Wind speed
            description: data.weather?.[0]?.description ?? "", // Weather description
            main: data.weather?.[0]?.main ?? "",
            dt: data.dt,
            sunrise: data.sys?.sunrise,
            sunset: data.sys?.sunset,
            clouds: data.clouds?.all ?? 0
          });
        } catch {
          // If API call fails, set weather to null (no popup will show)
          setWeather(null);
        }
      },
    });
    // This component doesn't render anything visible, just handles events
    return null;
  }

  // Function to handle popup close event
  const handlePopupClose = () => {
    setClickedPos(null);
    setWeather(null);
  };

  // useEffect hook - Opens the marker popup when weather data is available
  // This ensures the popup appears after the async weather fetch completes
  useEffect(() => {
    if (markerRef.current && clickedPos && weather != null) {
      markerRef.current.openPopup();
    }
  }, [clickedPos, weather]);

  // Define geographical bounds for the Canary Islands
  // Restricts map panning to prevent users from navigating away from the region
  const bounds = [
    [26.5, -19.5], // Southwest corner (latitude, longitude) - Expanded
    [30.5, -12.5], // Northeast corner - Expanded to allow popup space
  ];

  // Return the map JSX structure
  return (
    // Container div with centering and bottom margin to avoid footer overlap
    <div className="flex justify-center mb-20">
      {/* MapContainer - Main Leaflet map component */}
      <MapContainer
        center={[28.5, -16]} // Initial center point (Tenerife)
        zoom={8} // Initial zoom level
        minZoom={8} // Minimum zoom to keep islands visible
        maxBounds={bounds} // Restrict panning to Canary Islands
        maxBoundsViscosity={1.0} // How strictly to enforce bounds (1.0 = strict)
        scrollWheelZoom={true} // Allow zoom with mouse wheel
        className="leaflet-container shadow-xl dark:shadow-black/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl" // CSS class for styling
      >
        {/* TileLayer - Google Terrain (Relief) */}
        <TileLayer
          key={isDarkMode ? "dark" : "light"}
          className={isDarkMode ? "dark-map-tiles" : ""}
          attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google</a>'
          url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
        />

        {/* Include the click handler component */}
        <MapClickHandler />
        {/* Conditionally render marker when user has clicked */}
        {clickedPos && (
          <Marker position={clickedPos} ref={markerRef}>
            {/* Conditionally render weather popup when data is available */}
            {weather != null && (
              <WeatherPopup
                position={clickedPos}
                weather={weather}
                markerRef={markerRef}
                onClose={handlePopupClose}
              />
            )}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;

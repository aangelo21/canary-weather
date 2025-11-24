// WeatherPopup.jsx - Weather information popup component for Leaflet map
// This component displays weather data in a popup when a user clicks on the map.
// It shows temperature, humidity, pressure, wind, and provides a button to save
// the clicked location as a Point of Interest (POI).

import React, { useEffect, useRef, useState } from "react";
import { Popup } from "react-leaflet";
import { createOrUpdatePoi } from "../services/poiService";
import { useTranslation } from "react-i18next";

// WeatherPopup component - Displays weather info and POI creation option
// Used by InteractiveMap component when user clicks on map locations
function WeatherPopup({ position, weather, markerRef }) {
  const { t } = useTranslation();
  // Ref for the popup element
  const popupRef = useRef(null);
  // State to track if POI has been saved
  const [saved, setSaved] = useState(false);
  // State for save operation loading
  const [saving, setSaving] = useState(false);
  // State to check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect hook - Ensures popup opens when data is available
  useEffect(() => {
    if (popupRef.current && markerRef?.current) {
      markerRef.current.openPopup();
    }
  }, [position, weather, markerRef]);

  // useEffect hook - Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Early return if required props are missing
  if (!position || !weather) return null;

  // Function to save the clicked location as a POI
  const handleSavePoi = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert(t("loginRequired"));
      return;
    }

    setSaving(true);
    try {
      // Create POI with coordinates as name and basic data
      await createOrUpdatePoi({
        name: `POI ${position[0].toFixed(4)},${position[1].toFixed(4)}`,
        latitude: position[0],
        longitude: position[1],
        description: "",
        is_global: false,
        type: 'personal', // Personal POI by default
      });
      // Mark as saved to update UI
      setSaved(true);
      // Dispatch event to notify POI list to refresh
      window.dispatchEvent(new Event('poiCreated'));
    } catch (error) {
      alert(t("errorSavingPoi") + ": " + error.message);
    }
    setSaving(false);
  };

  // Determine Day/Night
  const currentTime = weather.dt || Math.floor(Date.now() / 1000);
  const isNight = weather.sunrise && weather.sunset 
    ? (currentTime < weather.sunrise || currentTime > weather.sunset)
    : false;

  // Determine Theme
  const themeClass = isNight
    ? "bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white"
    : "bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] text-slate-800";

  // Icons (SVGs)
  const getIcon = () => {
    const main = (weather.main || "").toLowerCase();
    const description = (weather.description || "").toLowerCase();
    const isCloudy = weather.clouds > 20;

    if (main.includes('thunder') || description.includes('thunder')) return <ThunderIcon />;
    if (main.includes('rain') || main.includes('drizzle')) return isNight ? <NightRainIcon /> : <DayRainIcon />;
    if (main.includes('clear')) return isNight ? <MoonIcon /> : <SunIcon />;
    if (main.includes('clouds')) return isNight ? <MoonCloudIcon /> : <SunCloudIcon />;
    
    return isNight ? <MoonIcon /> : <SunIcon />; // Default
  };

  // Return the Popup JSX structure
  return (
    // Leaflet Popup component positioned at clicked coordinates
    <Popup position={position} ref={popupRef} className="custom-popup-clean">
      {/* Popup content container */}
      <div className={`w-64 p-5 rounded-xl shadow-lg ${themeClass} font-sans overflow-hidden relative`}>
        {/* Background Glow Effect */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 ${isNight ? 'bg-purple-500' : 'bg-yellow-300'}`}></div>

        {/* Top Section: Icon & Temp */}
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-16 h-16 filter drop-shadow-lg transform hover:scale-110 transition-transform duration-300">
                {getIcon()}
            </div>
            <div className="text-right">
                <div className="text-4xl font-bold tracking-tighter">{Math.round(weather.temp)}°</div>
                <div className="text-sm opacity-80 capitalize font-medium">{weather.description}</div>
            </div>
        </div>

        {/* Bottom Section: Stats */}
        <div className="flex justify-between items-center text-xs opacity-90 mt-4 pt-4 border-t border-white/10 relative z-10">
            <div className="flex flex-col items-center gap-1">
                <WindIcon className="w-4 h-4" />
                <span className="font-medium">{weather.wind} m/s</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <HumidityIcon className="w-4 h-4" />
                <span className="font-medium">{weather.humidity}%</span>
            </div>
             <div className="flex flex-col items-center gap-1">
                <PressureIcon className="w-4 h-4" />
                <span className="font-medium">{weather.pressure}</span>
            </div>
        </div>
        
        {/* Save Button */}
        <button
          className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative z-10 ${
            isNight 
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/10" 
                : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 border border-blue-200"
          }`}
          onClick={handleSavePoi}
          disabled={saved || saving || !isAuthenticated}
        >
          {saving
            ? t("savingPoi")
            : saved
            ? t("saved")
            : !isAuthenticated
            ? t("loginToSave")
            : t("saveAsPoi")}
        </button>

        {/* Success message when POI is saved */}
        {saved && (
          <div className="mt-2 text-center text-xs font-medium text-green-500">{t("poiSaved")}</div>
        )}
      </div>
    </Popup>
  );
}

// --- SVG Icons ---

const SunIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full text-yellow-400 fill-current">
    <circle cx="32" cy="32" r="14" />
    <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M32 8V4m0 56v-4m24-24h4M4 32h4m40.97 16.97l2.83 2.83M12.2 12.2l2.83 2.83m33.94 0l2.83-2.83M12.2 51.8l2.83-2.83" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full text-purple-200 fill-current">
    <path d="M46 42.67c-1.6 0-3.2-.3-4.7-.8-8.1-2.9-12.4-11.8-9.5-19.9.6-1.7 1.5-3.3 2.6-4.7-10.4 1.2-18.8 9.6-19.9 20.1-1.5 13.6 8.4 25.9 22 27.4 10.4 1.1 20.1-4.6 24.5-13.4-4.5 6.9-12.4 11.3-20.8 11.3-13.8 0-25-11.2-25-25 0-8.4 4.4-16.3 11.3-20.8-.9 4.4 4.8 14.1 13.4 24.5 1.4 1.1 3 2 4.7 2.6 1.5.5 3.1.8 4.7.8h.1z" />
  </svg>
);

const SunCloudIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <circle cx="24" cy="24" r="10" className="text-yellow-400 fill-current" />
    <path className="text-white fill-current filter drop-shadow-md" d="M46 46H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 25.6 32.9 22 38 22c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" />
  </svg>
);

const MoonCloudIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <path className="text-purple-200 fill-current" d="M28 18c-5.8 0-10.9 3.1-13.7 7.8 1.8-1.1 3.9-1.8 6.2-1.8 6.6 0 12 5.4 12 12 0 2.3-.7 4.4-1.8 6.2 4.7-2.8 7.8-7.9 7.8-13.7C38.5 22.1 33.9 18 28 18z" />
    <path className="text-white/90 fill-current filter drop-shadow-md" d="M46 46H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 25.6 32.9 22 38 22c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" />
  </svg>
);

const DayRainIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <circle cx="24" cy="24" r="10" className="text-yellow-400 fill-current" />
    <path className="text-white fill-current filter drop-shadow-md" d="M46 40H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 19.6 32.9 16 38 16c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" />
    <path className="text-blue-400 fill-current" d="M28 46l-2 6m8-6l-2 6m8-6l-2 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const NightRainIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <path className="text-purple-200 fill-current" d="M28 18c-5.8 0-10.9 3.1-13.7 7.8 1.8-1.1 3.9-1.8 6.2-1.8 6.6 0 12 5.4 12 12 0 2.3-.7 4.4-1.8 6.2 4.7-2.8 7.8-7.9 7.8-13.7C38.5 22.1 33.9 18 28 18z" />
    <path className="text-white/80 fill-current filter drop-shadow-md" d="M46 40H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 19.6 32.9 16 38 16c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" />
    <path className="text-blue-300 fill-current" d="M28 46l-2 6m8-6l-2 6m8-6l-2 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ThunderIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <path className="text-gray-400 fill-current filter drop-shadow-md" d="M46 40H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 19.6 32.9 16 38 16c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" />
    <path className="text-yellow-500 fill-current" d="M34 38l-6 10h4l-2 8 10-10h-4l4-8z" />
  </svg>
);

const WindIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
  </svg>
);

const HumidityIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const PressureIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default WeatherPopup;

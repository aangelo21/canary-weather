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
function WeatherPopup({ position, weather, markerRef, onClose }) {
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
    const user = localStorage.getItem("cw_user");
    setIsAuthenticated(!!user);
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

  // Determine Theme based on weather condition and time
  const getTheme = () => {
    const main = (weather.main || "").toLowerCase();
    
    if (main.includes('thunder')) {
        return "bg-gradient-to-br from-[#1e293b] to-[#334155] text-white shadow-indigo-900/50"; // Dark/Thunder
    }
    if (isNight) {
        return "bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-slate-900/50"; // Night
    }
    // Day default (Sunny/Cloudy) - Light Blue
    return "bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] text-slate-700 shadow-blue-200/50";
  };

  const themeClass = getTheme();
  const isDarkTheme = isNight || (weather.main || "").toLowerCase().includes('thunder');

  // Icons (Emojis)
  const getIcon = () => {
    const main = (weather.main || "").toLowerCase();
    const description = (weather.description || "").toLowerCase();

    // Thunderstorm
    if (main.includes('thunder') || description.includes('thunder')) return <span className="text-6xl">⛈️</span>;
    
    // Snow
    if (main.includes('snow')) return <span className="text-6xl">❄️</span>;

    // Rain / Drizzle
    if (main.includes('rain') || main.includes('drizzle')) return <span className="text-6xl">🌧️</span>;

    // Atmosphere (Fog, Mist, etc.)
    if (['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado'].some(t => main.includes(t))) {
        return <span className="text-6xl">🌫️</span>;
    }

    // Clear
    if (main.includes('clear')) return isNight ? <span className="text-6xl">🌙</span> : <span className="text-6xl">☀️</span>;

    // Clouds
    if (main.includes('clouds')) {
        // Check for "few clouds" or "scattered clouds" for partly cloudy icon during day
        if (!isNight && (description.includes('few') || description.includes('scattered'))) {
             return <span className="text-6xl">⛅</span>;
        }
        return <span className="text-6xl">☁️</span>;
    }
    
    // Default
    return isNight ? <span className="text-6xl">🌙</span> : <span className="text-6xl">☀️</span>;
  };

  // Return the Popup JSX structure
  return (
    // Leaflet Popup component positioned at clicked coordinates
    <Popup 
      position={position} 
      ref={popupRef} 
      className="custom-popup-clean"
      autoPanPadding={[50, 50]}
      eventHandlers={{
        remove: () => {
          if (onClose) onClose();
        }
      }}
    >
      {/* Popup content container - Card Style */}
      <div className={`w-72 p-6 rounded-3xl shadow-2xl ${themeClass} font-sans overflow-hidden relative select-none`}>
        
        {/* Top Section: Icon & Temp */}
        <div className="flex justify-between items-center mb-8 relative z-10">
            {/* Icon Container */}
            <div className="w-24 h-24 filter drop-shadow-xl transform -translate-x-2 flex items-center justify-center">
                {getIcon()}
            </div>
            
            {/* Temp & Desc */}
            <div className="text-right flex flex-col justify-center">
                <div className="text-5xl font-bold tracking-tighter leading-none">
                    {Math.round(weather.temp)}<span className="text-3xl align-top">°</span>
                </div>
                <div className={`text-sm font-medium mt-1 capitalize ${isDarkTheme ? 'text-blue-200' : 'text-blue-500'}`}>
                    {weather.description}
                </div>
            </div>
        </div>

        {/* Bottom Section: Stats Row */}
        <div className={`flex justify-between items-center px-2 relative z-10 ${isDarkTheme ? 'text-gray-300' : 'text-slate-500'}`}>
            {/* Wind */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl mb-1">💨</span>
                <span className="text-xs font-semibold">{weather.wind} km/h</span>
                <span className="text-[10px] opacity-60">Wind</span>
            </div>
            
            {/* Humidity */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl mb-1">💧</span>
                <span className="text-xs font-semibold">{weather.humidity}%</span>
                <span className="text-[10px] opacity-60">Humidity</span>
            </div>
            
            {/* Clouds/Pressure (Using Clouds as 3rd metric to match visual style of 'coverage') */}
             <div className="flex flex-col items-center gap-1">
                <span className="text-2xl mb-1">☁️</span>
                <span className="text-xs font-semibold">{weather.clouds}%</span>
                <span className="text-[10px] opacity-60">Clouds</span>
            </div>
        </div>
        
        {/* Save Button - Subtle & Integrated */}
        <button
          className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 relative z-10 flex items-center justify-center gap-2 ${
            isDarkTheme 
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/5" 
                : "bg-white/60 hover:bg-white/80 text-blue-600 shadow-sm"
          }`}
          onClick={handleSavePoi}
          disabled={saved || saving || !isAuthenticated}
        >
          {saving ? (
             <span>{t("savingPoi")}...</span>
          ) : saved ? (
             <>
                <span className="text-base">✔️</span>
                <span>{t("saved")}</span>
             </>
          ) : !isAuthenticated ? (
             <span>{t("loginToSave")}</span>
          ) : (
             <span>{t("saveAsPoi")}</span>
          )}
        </button>
      </div>
    </Popup>
  );
}

export default WeatherPopup;

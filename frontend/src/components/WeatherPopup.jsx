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

  // Icons (SVGs) - Enhanced for "3D-like" look with gradients
  const getIcon = () => {
    const main = (weather.main || "").toLowerCase();
    const description = (weather.description || "").toLowerCase();

    if (main.includes('thunder') || description.includes('thunder')) return <ThunderIcon3D />;
    if (main.includes('rain') || main.includes('drizzle')) return isNight ? <NightRainIcon3D /> : <DayRainIcon3D />;
    if (main.includes('clear')) return isNight ? <MoonIcon3D /> : <SunIcon3D />;
    if (main.includes('clouds')) return isNight ? <MoonCloudIcon3D /> : <SunCloudIcon3D />;
    
    return isNight ? <MoonIcon3D /> : <SunIcon3D />; // Default
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
            <div className="w-24 h-24 filter drop-shadow-xl transform -translate-x-2">
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
                <WindIcon className="w-5 h-5 mb-1 opacity-70" />
                <span className="text-xs font-semibold">{weather.wind} km/h</span>
                <span className="text-[10px] opacity-60">Wind</span>
            </div>
            
            {/* Humidity */}
            <div className="flex flex-col items-center gap-1">
                <HumidityIcon className="w-5 h-5 mb-1 opacity-70" />
                <span className="text-xs font-semibold">{weather.humidity}%</span>
                <span className="text-[10px] opacity-60">Humidity</span>
            </div>
            
            {/* Clouds/Pressure (Using Clouds as 3rd metric to match visual style of 'coverage') */}
             <div className="flex flex-col items-center gap-1">
                <CloudIcon className="w-5 h-5 mb-1 opacity-70" />
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
                <CheckIcon className="w-4 h-4" />
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

// --- 3D-like SVG Icons (Using gradients and layers) ---

const SunIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="32" cy="32" r="16" fill="url(#sunGradient)" filter="url(#glow)" />
    <circle cx="32" cy="32" r="22" stroke="#FDE047" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />
  </svg>
);

const MoonIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M42 38c-2 0-4-.5-6-1.5-10-5-14-16-10-26 .5-1.5 1.5-3 2.5-4-12 2-20 12-20 24 0 14 11 25 25 25 10 0 19-7 22-16-5 6-12 8.5-13.5 8.5z" fill="url(#moonGradient)" filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.2))" />
    <circle cx="48" cy="18" r="1" fill="white" opacity="0.8" />
    <circle cx="54" cy="24" r="1.5" fill="white" opacity="0.6" />
  </svg>
);

const SunCloudIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <radialGradient id="sunGradientSmall" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
      <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="12" fill="url(#sunGradientSmall)" />
    <path d="M46 46H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 25.6 32.9 22 38 22c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" fill="url(#cloudGradient)" filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.1))" />
  </svg>
);

const MoonCloudIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="moonGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <linearGradient id="cloudGradientNight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <path d="M28 18c-5.8 0-10.9 3.1-13.7 7.8 1.8-1.1 3.9-1.8 6.2-1.8 6.6 0 12 5.4 12 12 0 2.3-.7 4.4-1.8 6.2 4.7-2.8 7.8-7.9 7.8-13.7C38.5 22.1 33.9 18 28 18z" fill="url(#moonGradientSmall)" />
    <path d="M46 46H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 25.6 32.9 22 38 22c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" fill="url(#cloudGradientNight)" filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.3))" />
  </svg>
);

const DayRainIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="cloudGradientRain" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    <path d="M46 40H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 19.6 32.9 16 38 16c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" fill="url(#cloudGradientRain)" filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.1))" />
    <path d="M28 46l-2 6m8-6l-2 6m8-6l-2 6" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const NightRainIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="cloudGradientRainNight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <path d="M46 40H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 19.6 32.9 16 38 16c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" fill="url(#cloudGradientRainNight)" filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.3))" />
    <path d="M28 46l-2 6m8-6l-2 6m8-6l-2 6" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ThunderIcon3D = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="cloudGradientThunder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M46 40H26c-4.4 0-8-3.6-8-8s3.6-8 8-8c.4 0 .7 0 1.1.1C28.5 19.6 32.9 16 38 16c5.5 0 10 4.5 10 10 0 .3 0 .7-.1 1 .3 0 .7-.1 1.1-.1 4.4 0 8 3.6 8 8s-3.6 8-8 8z" fill="url(#cloudGradientThunder)" filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.3))" />
    <path d="M34 38l-6 10h4l-2 8 10-10h-4l4-8z" fill="url(#boltGradient)" filter="drop-shadow(0px 0px 5px rgba(253, 224, 71, 0.5))" />
  </svg>
);

// --- Simple Icons for Stats ---

const WindIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
  </svg>
);

const HumidityIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c-5.385 5.965-8.25 10.575-8.25 13.5 0 4.557 3.693 8.25 8.25 8.25s8.25-3.693 8.25-8.25C20.25 12.825 17.385 8.215 12 2.25z" />
  </svg>
);

const CloudIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default WeatherPopup;

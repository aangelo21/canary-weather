import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * MapLegend Component.
 *
 * A comprehensive, interactive guide for the Canary Weather Map.
 * It provides detailed information about weather layers, map controls, and interaction modes.
 *
 * Features:
 * - **Interactive Tabs**: Users can switch between 'Layers', 'Controls', and 'Interactions' for focused information.
 * - **Visual Color Scales**: Represents temperature and precipitation gradients visually.
 * - **Professional UI**: Uses glassmorphism, gradients, and refined typography for a polished look.
 *
 * @component
 * @returns {JSX.Element} The rendered MapLegend component.
 */
function MapLegend() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('layers');

    const tabs = [
        { id: 'layers', label: 'Weather Layers', icon: '🌤️' },
        { id: 'controls', label: 'Map Controls', icon: '🎮' },
        { id: 'interaction', label: 'Interactions', icon: '👆' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-w-5xl mx-auto mt-12 transition-all duration-300">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-brand-primary to-blue-600 p-6 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Interactive Map Guide
                </h3>
                <p className="text-blue-100 mt-2 text-sm max-w-2xl">
                    Master the map features to get the most precise weather insights for the Canary Islands.
                    Switch tabs below to explore different functionalities.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
                            ${activeTab === tab.id 
                                ? 'text-brand-primary border-b-2 border-brand-primary bg-white dark:bg-gray-800 dark:text-blue-400' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 min-h-[400px]">
                
                {/* LAYERS TAB */}
                {activeTab === 'layers' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Temperature Layer */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Temperature Heatmap</h4>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    Visualizes air temperature at 2 meters above ground. Warmer colors indicate higher temperatures.
                                </p>
                                {/* Color Scale Visualization */}
                                <div className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-green-400 to-red-500 w-full mb-1"></div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    <span>0°C</span>
                                    <span>15°C</span>
                                    <span>30°C+</span>
                                </div>
                            </div>

                            {/* Precipitation Layer */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Precipitation Intensity</h4>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    Shows rain intensity. Darker blue/purple areas indicate heavier rainfall.
                                </p>
                                {/* Color Scale Visualization */}
                                <div className="h-4 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-purple-600 w-full mb-1 border border-gray-200 dark:border-gray-600"></div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    <span>Light</span>
                                    <span>Moderate</span>
                                    <span>Heavy</span>
                                </div>
                            </div>

                            {/* Clouds Layer */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Cloud Cover</h4>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Displays total cloud coverage percentage. Opaque white areas represent 100% cloud cover (overcast), while transparent areas are clear skies.
                                </p>
                            </div>

                            {/* Wind Layer */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Wind Speed</h4>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Dynamic visualization of wind flow. Faster moving particles and warmer colors indicate higher wind speeds (km/h).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTROLS TAB */}
                {activeTab === 'controls' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                        <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Search Bar</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Quickly find any city, town, or municipality in the Canary Islands. Just type the name and hit enter.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white">My Location</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Click the target icon to instantly center the map on your current GPS position.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Reset View</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Lost? Use the reset button to zoom back out to the full view of the Canary Islands archipelago.
                            </p>
                        </div>
                    </div>
                )}

                {/* INTERACTIONS TAB */}
                {activeTab === 'interaction' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
                            <span className="text-3xl">👆</span>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Click Anywhere</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Clicking on any point on the map (land or sea) will drop a pin and show a <strong>Weather Popup</strong> with real-time data for that exact coordinate.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-800">
                            <span className="text-3xl">📍</span>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Save Points of Interest</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Logged-in users can save any location as a "Personal POI" directly from the weather popup. These will appear in your "Points of Interest" list.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                            <span className="text-3xl">🗺️</span>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Layer Switching</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Use the layer control icon (top-right of the map) to toggle between <strong>Satellite</strong>, <strong>Terrain</strong>, and various weather overlays like Clouds or Rain.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MapLegend;

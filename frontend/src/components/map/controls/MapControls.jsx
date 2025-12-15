import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import MapLegend from './MapLegend';

/**
 * MapControls Component.
 *
 * Renders custom map controls for reset, locate, and search with a modern glassmorphism design.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setClickedPos - Function to update the clicked position state.
 * @param {Function} props.fetchWeather - Function to fetch weather data for a location.
 */
const MapControls = ({ setClickedPos, fetchWeather }) => {
    const { t } = useTranslation();
    const map = useMap();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Disable click propagation to prevent map clicks when interacting with controls
    useEffect(() => {
        const controls = document.getElementById('map-controls');
        if (controls) {
            L.DomEvent.disableClickPropagation(controls);
        }
    }, []);

    const handleReset = () => {
        map.flyTo([28.5, -16], 8, {
            duration: 1.5,
            easeLinearity: 0.25,
        });
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            alert(t('geolocationNotSupported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.flyTo([latitude, longitude], 13, {
                    duration: 1.5,
                });
                setClickedPos([latitude, longitude]);
                fetchWeather(latitude, longitude);
            },
            () => {
                alert(t('locationRetrievalError'));
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        );
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Use Nominatim for search, bounded to Canary Islands
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery,
                )}&viewbox=-19.5,26.5,-12.5,30.5&bounded=1`,
            );
            const results = await response.json();

            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                map.flyTo([latitude, longitude], 13, {
                    duration: 1.5,
                });
                setClickedPos([latitude, longitude]);
                fetchWeather(latitude, longitude);
                setSearchQuery(''); // Clear search after successful find
            } else {
                alert(t('locationNotFound'));
            }
        } catch (error) {
            console.error('Search failed:', error);
            alert(t('searchFailed'));
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div
            id="map-controls"
            className="absolute top-4 left-4 z-1000 flex flex-col gap-3 w-full max-w-xs items-start"
        >
            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/50 w-full"
            >
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-medium rounded-2xl"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors disabled:opacity-50"
                >
                    {isSearching ? (
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    )}
                </button>
            </form>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 font-medium text-sm"
                    title={t('resetView')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    <span className="hidden sm:inline">{t('reset')}</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLocate();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/90 backdrop-blur-md rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-500/20 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 font-medium text-sm"
                    title={t('myLocation')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="hidden sm:inline">{t('locate')}</span>
                </button>

                {/* Legend Button */}
                <div onClick={(e) => e.stopPropagation()}>
                    <MapLegend />
                </div>
            </div>
        </div>
    );
};

export default MapControls;

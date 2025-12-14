import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { createOrUpdatePoi } from '../../services/poiService';
import Skeleton from '../common/Skeleton';

/**
 * Sidebar Component.
 *
 * Displays detailed weather information and POI actions in a sliding sidebar.
 * Replaces the traditional popup for a more immersive experience similar to OpenStreetMap.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the sidebar is open.
 * @param {Function} props.onClose - Function to close the sidebar.
 * @param {Object} props.weather - Weather data object.
 * @param {boolean} props.loading - Whether weather data is loading.
 * @param {Array<number>} props.position - The [lat, lng] coordinates.
 */
const Sidebar = ({ isOpen, onClose, weather, loading, position }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useTheme();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('cw_user');
        setIsAuthenticated(!!user);
    }, []);

    // Reset saved state when position changes
    useEffect(() => {
        setSaved(false);
    }, [position]);

    const handleSavePoi = async () => {
        if (!isAuthenticated) {
            alert(t('loginRequired'));
            return;
        }

        setSaving(true);
        try {
            await createOrUpdatePoi({
                name: `POI ${position[0].toFixed(4)},${position[1].toFixed(4)}`,
                latitude: position[0],
                longitude: position[1],
                description: '',
                is_global: false,
                type: 'personal',
            });
            setSaved(true);
            window.dispatchEvent(new Event('poiCreated'));
        } catch (error) {
            alert(t('errorSavingPoi') + ': ' + error.message);
        }
        setSaving(false);
    };

    if (!isOpen) return null;

    return (
        <div className={`absolute top-0 left-0 h-full w-80 sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-[2000] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto border-r border-gray-200 dark:border-gray-800`}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {loading ? t('loading') : t('locationDetails')}
                </h2>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 w-full rounded-xl" />
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                    </div>
                ) : weather ? (
                    <>
                        {/* Coordinates */}
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            {position[0].toFixed(5)}, {position[1].toFixed(5)}
                        </div>

                        {/* Main Weather Card */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-5xl font-bold mb-1">
                                        {Math.round(weather.temp)}°
                                    </div>
                                    <div className="text-blue-100 font-medium capitalize text-lg">
                                        {weather.description}
                                    </div>
                                </div>
                                <div className="text-5xl opacity-90">
                                    {/* Simple icon mapping based on description/main */}
                                    {weather.main.toLowerCase().includes('cloud') ? '☁️' : 
                                     weather.main.toLowerCase().includes('rain') ? '🌧️' : 
                                     weather.main.toLowerCase().includes('clear') ? '☀️' : '🌤️'}
                                </div>
                            </div>
                        </div>

                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Wind</div>
                                <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>💨</span> {weather.wind} <span className="text-sm font-normal text-gray-500">km/h</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Humidity</div>
                                <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>💧</span> {weather.humidity}<span className="text-sm font-normal text-gray-500">%</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Pressure</div>
                                <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>📉</span> {weather.pressure} <span className="text-sm font-normal text-gray-500">hPa</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Clouds</div>
                                <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>☁️</span> {weather.clouds}<span className="text-sm font-normal text-gray-500">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={handleSavePoi}
                                disabled={saved || saving || !isAuthenticated}
                                className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                                    saved 
                                        ? 'bg-green-500 text-white cursor-default'
                                        : !isAuthenticated
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                                }`}
                            >
                                {saving ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : saved ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Saved Location
                                    </>
                                ) : !isAuthenticated ? (
                                    'Login to Save'
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Save Location
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        Select a location on the map to see weather details.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { createOrUpdatePoi } from '../../services/poiService';
import Skeleton from '../common/Skeleton';
import HourlyForecast from '../home/HourlyForecast';


const Sidebar = ({ isOpen, onClose, weather, loading, position }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useTheme();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem('cw_user');
            setIsAuthenticated(!!user);
        };

        checkAuth();
        window.addEventListener('userLoggedIn', checkAuth);

        return () => {
            window.removeEventListener('userLoggedIn', checkAuth);
        };
    }, []);

    
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
        <div
            className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-2000 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto border-l border-white/20 dark:border-gray-700/30`}
        >
            {}
            <div className="sticky top-0 z-20 flex items-center justify-between p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/50">
                <div>
                    <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        {loading ? t('loading') : t('locationDetailsTitle')}
                    </h2>
                    {position && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                            {position[0].toFixed(4)}°N, {position[1].toFixed(4)}
                            °W
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {}
            <div className="p-6 space-y-8">
                {loading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                        </div>
                        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
                    </div>
                ) : weather ? (
                    <>
                        {}
                        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 p-6 group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                            {}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <div className="flex items-start">
                                        <span className="text-7xl font-bold tracking-tighter">
                                            {Math.round(weather.temp)}
                                        </span>
                                        <span className="text-3xl font-light mt-2 opacity-80">
                                            °
                                        </span>
                                    </div>
                                    <div className="text-blue-100 font-medium capitalize text-lg mt-1 flex items-center gap-2">
                                        {weather.description}
                                    </div>
                                </div>
                                <div className="text-8xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    {weather.main
                                        .toLowerCase()
                                        .includes('cloud')
                                        ? '☁️'
                                        : weather.main
                                                .toLowerCase()
                                                .includes('rain')
                                          ? '🌧️'
                                          : weather.main
                                                  .toLowerCase()
                                                  .includes('clear')
                                            ? '☀️'
                                            : '🌤️'}
                                </div>
                            </div>

                            <div className="relative z-10 mt-6 flex items-center gap-6 text-sm font-medium text-blue-50/80">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                    <span>
                                        L: {Math.round(weather.temp - 3)}°
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        />
                                    </svg>
                                    <span>
                                        H: {Math.round(weather.temp + 3)}°
                                    </span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    label: 'Wind',
                                    value: `${weather.wind} km/h`,
                                    icon: '💨',
                                    color: 'text-cyan-500',
                                },
                                {
                                    label: 'Humidity',
                                    value: `${weather.humidity}%`,
                                    icon: '💧',
                                    color: 'text-blue-500',
                                },
                                {
                                    label: 'Pressure',
                                    value: `${weather.pressure} hPa`,
                                    icon: '📉',
                                    color: 'text-purple-500',
                                },
                                {
                                    label: 'Clouds',
                                    value: `${weather.clouds}%`,
                                    icon: '☁️',
                                    color: 'text-gray-500',
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">
                                            {item.icon}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div
                                        className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {}
                        <div className="bg-white dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    24-Hour Forecast
                                </h3>
                            </div>
                            <div className="p-2">
                                <HourlyForecast
                                    coords={{
                                        lat: position[0],
                                        lon: position[1],
                                    }}
                                    compact={true}
                                />
                            </div>
                        </div>

                        {}
                        <div className="pt-2">
                            <button
                                onClick={handleSavePoi}
                                disabled={saved || saving || !isAuthenticated}
                                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                                    saved
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 cursor-default'
                                        : !isAuthenticated
                                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                          : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/30'
                                }`}
                            >
                                {saving ? (
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
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
                                        <span>Saving...</span>
                                    </div>
                                ) : saved ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>{t('locationSaved')}</span>
                                    </>
                                ) : !isAuthenticated ? (
                                    <span>{t('loginToSave')}</span>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>{t('savePointOfInterest')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 opacity-60">
                        <svg
                            className="w-20 h-20 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                        </svg>
                        <p className="text-lg font-medium">
                            {t('selectLocation')}
                        </p>
                        <p className="text-sm">{t('clickAnywhere')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

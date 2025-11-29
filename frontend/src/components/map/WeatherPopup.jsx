import React, { useEffect, useRef, useState } from 'react';
import { Popup } from 'react-leaflet';
import { createOrUpdatePoi } from '../../services/poiService';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

/**
 * WeatherPopup component.
 * Displays weather data in a popup when a user clicks on the map.
 * It shows temperature, humidity, pressure, wind, and provides a button to save
 * the clicked location as a Point of Interest (POI).
 *
 * @param {Object} props - The component props.
 * @param {Array} props.position - The [lat, lng] coordinates of the popup.
 * @param {Object} props.weather - The weather data object.
 * @param {Object} props.markerRef - Reference to the marker element.
 * @param {Function} props.onClose - Callback function when the popup is closed.
 * @returns {JSX.Element|null} The rendered WeatherPopup component or null if props are missing.
 */
function WeatherPopup({ position, weather, markerRef, onClose }) {
    const { t } = useTranslation();
    const { isDarkMode } = useTheme();
    const popupRef = useRef(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (popupRef.current && markerRef?.current) {
            markerRef.current.openPopup();
        }
    }, [position, weather, markerRef]);

    useEffect(() => {
        const user = localStorage.getItem('cw_user');
        setIsAuthenticated(!!user);
    }, []);

    if (!position || !weather) return null;

    /**
     * Handles saving the current location as a POI.
     */
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

    const currentTime = weather.dt || Math.floor(Date.now() / 1000);
    const isNight =
        weather.sunrise && weather.sunset
            ? currentTime < weather.sunrise || currentTime > weather.sunset
            : false;

    /**
     * Determines the theme class based on weather conditions and time.
     *
     * @returns {string} The CSS class string for the theme.
     */
    const getTheme = () => {
        const main = (weather.main || '').toLowerCase();

        if (isDarkMode) {
            return 'bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-md text-white shadow-xl shadow-black/50 border border-white/10';
        }

        if (main.includes('thunder')) {
            return 'bg-gradient-to-br from-[#1e293b] to-[#334155] text-white shadow-indigo-900/50';
        }
        if (isNight) {
            return 'bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-slate-900/50';
        }
        return 'bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] text-slate-700 shadow-blue-200/50';
    };

    const themeClass = getTheme();
    const isDarkTheme =
        isDarkMode ||
        isNight ||
        (weather.main || '').toLowerCase().includes('thunder');

    /**
     * Returns the appropriate weather icon based on conditions.
     *
     * @returns {JSX.Element} The weather icon element.
     */
    const getIcon = () => {
        const main = (weather.main || '').toLowerCase();
        const description = (weather.description || '').toLowerCase();

        if (main.includes('thunder') || description.includes('thunder'))
            return <span className="text-6xl">⛈️</span>;

        if (main.includes('snow')) return <span className="text-6xl">❄️</span>;

        if (main.includes('rain') || main.includes('drizzle'))
            return <span className="text-6xl">🌧️</span>;

        if (
            [
                'mist',
                'smoke',
                'haze',
                'dust',
                'fog',
                'sand',
                'ash',
                'squall',
                'tornado',
            ].some((t) => main.includes(t))
        ) {
            return <span className="text-6xl">🌫️</span>;
        }

        if (main.includes('clear'))
            return isNight ? (
                <span className="text-6xl">🌙</span>
            ) : (
                <span className="text-6xl">☀️</span>
            );

        if (main.includes('clouds')) {
            if (
                !isNight &&
                (description.includes('few') ||
                    description.includes('scattered'))
            ) {
                return <span className="text-6xl">⛅</span>;
            }
            return <span className="text-6xl">☁️</span>;
        }

        return isNight ? (
            <span className="text-6xl">🌙</span>
        ) : (
            <span className="text-6xl">☀️</span>
        );
    };

    return (
        <Popup
            position={position}
            ref={popupRef}
            className="custom-popup-clean"
            autoPanPadding={[50, 50]}
            eventHandlers={{
                remove: () => {
                    if (onClose) onClose();
                },
            }}
        >
            <div
                className={`w-72 p-6 rounded-3xl shadow-2xl ${themeClass} font-sans overflow-hidden relative select-none`}
            >
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="w-24 h-24 filter drop-shadow-xl transform -translate-x-2 flex items-center justify-center">
                        {getIcon()}
                    </div>

                    <div className="text-right flex flex-col justify-center">
                        <div className="text-5xl font-bold tracking-tighter leading-none">
                            {Math.round(weather.temp)}
                            <span className="text-3xl align-top">°</span>
                        </div>
                        <div
                            className={`text-sm font-medium mt-1 capitalize ${isDarkTheme ? 'text-blue-200' : 'text-blue-500'}`}
                        >
                            {weather.description}
                        </div>
                    </div>
                </div>

                <div
                    className={`flex justify-between items-center px-2 relative z-10 ${isDarkTheme ? 'text-gray-300' : 'text-slate-500'}`}
                >
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl mb-1">💨</span>
                        <span className="text-xs font-semibold">
                            {weather.wind} km/h
                        </span>
                        <span className="text-[10px] opacity-60">Wind</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl mb-1">💧</span>
                        <span className="text-xs font-semibold">
                            {weather.humidity}%
                        </span>
                        <span className="text-[10px] opacity-60">Humidity</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl mb-1">☁️</span>
                        <span className="text-xs font-semibold">
                            {weather.clouds}%
                        </span>
                        <span className="text-[10px] opacity-60">Clouds</span>
                    </div>
                </div>

                <button
                    className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 relative z-10 flex items-center justify-center gap-2 ${
                        isDarkTheme
                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
                            : 'bg-white/60 hover:bg-white/80 text-blue-600 shadow-sm'
                    }`}
                    onClick={handleSavePoi}
                    disabled={saved || saving || !isAuthenticated}
                >
                    {saving ? (
                        <span>{t('savingPoi')}...</span>
                    ) : saved ? (
                        <>
                            <span className="text-base">✔️</span>
                            <span>{t('saved')}</span>
                        </>
                    ) : !isAuthenticated ? (
                        <span>{t('loginToSave')}</span>
                    ) : (
                        <span>{t('saveAsPoi')}</span>
                    )}
                </button>
            </div>
        </Popup>
    );
}

export default WeatherPopup;

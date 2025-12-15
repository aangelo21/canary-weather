import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '../common/Skeleton';
import AIAssistant from './AIAssistant';

/**
 * Hero Component.
 *
 * This component renders the "Hero" section of the Home page.
 * It now includes a real-time weather card that fetches data based on the user's location.
 *
 * Features:
 * - **Real-time Weather**: Fetches weather data from OpenWeatherMap API.
 * - **Auto-Refresh**: Updates weather data every 5 minutes to keep it current.
 * - **Geolocation**: Uses the browser's Geolocation API to get the user's position.
 * - **Dynamic Icons**: Displays different animated icons based on weather conditions.
 * - **Responsive Design**: Maintains the original responsive layout.
 */
export default function Hero({ coords }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    // State for weather data, location name, loading status, and errors
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState({
        city: 'Locating...',
        region: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches weather data from OpenWeatherMap API.
     * Switched from OpenMeteo to OpenWeatherMap to ensure data consistency with other app components.
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    const fetchWeatherData = useCallback(
        async (lat, lon) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
                );
                const data = await response.json();

                // Map OpenWeatherMap response to our internal structure
                setWeather({
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    wind_speed: data.wind.speed, // Note: OWM returns m/s by default with metric units
                    weather_id: data.weather[0].id,
                    is_day:
                        data.dt > data.sys.sunrise && data.dt < data.sys.sunset
                            ? 1
                            : 0,
                    description: data.weather[0].main,
                });
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch weather data:', err);
                setError('Failed to load weather data.');
                setLoading(false);
            }
        },
        [OPENWEATHER_API_KEY],
    );

    /**
     * Fetches location name using a reverse geocoding API.
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    const fetchLocationName = useCallback(async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
            );
            const data = await response.json();
            setLocationName({
                city: data.city || data.locality || 'Unknown Location',
                region: data.principalSubdivision || data.countryName || '',
            });
        } catch (err) {
            console.error('Failed to fetch location name:', err);
            setLocationName({ city: 'Unknown', region: '' });
        }
    }, []);

    /**
     * Effect to fetch weather when coords prop changes.
     * Coords are now managed by the parent Home component.
     */
    useEffect(() => {
        if (coords) {
            fetchWeatherData(coords.lat, coords.lon);
            fetchLocationName(coords.lat, coords.lon);
        }
    }, [coords, fetchWeatherData, fetchLocationName]);

    /**
     * Effect to auto-refresh weather data every 5 minutes.
     * This ensures the wind speed and other metrics stay up-to-date.
     */
    useEffect(() => {
        if (!coords) return;

        const intervalId = setInterval(() => {
            fetchWeatherData(coords.lat, coords.lon);
        }, 300000); // 300,000 ms = 5 minutes

        return () => clearInterval(intervalId);
    }, [coords, fetchWeatherData]);

    /**
     * Helper function to get the weather description and icon based on OWM weather ID.
     * @param {number} id - OpenWeatherMap weather condition ID
     * @param {number} isDay - 1 for day, 0 for night
     * @returns {Object} - Contains label (description) and icon (JSX)
     */
    const getWeatherDetails = (id, isDay) => {
        // Default to Sunny/Clear
        let label = 'Sunny & Clear';
        let icon = (
            <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <svg
                    className="w-full h-full text-orange-500 animate-[spin_10s_linear_infinite]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            </div>
        );

        // Map OWM IDs to descriptions and icons
        // Group 2xx: Thunderstorm
        if (id >= 200 && id < 300) {
            label = 'Thunderstorm';
            icon = (
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <svg
                        className="w-full h-full text-purple-600 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>
            );
        }
        // Group 3xx: Drizzle & Group 5xx: Rain
        else if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) {
            label = 'Rainy';
            icon = (
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <svg
                        className="w-full h-full text-blue-500 animate-bounce"
                        style={{ animationDuration: '3s' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 16.2A4.5 4.5 0 0017.5 8h-1.832A4.5 4.5 0 009.355 8H7.5a4.5 4.5 0 00-1.3 8.8"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 18v-2m-4 2v-4m-4 4v-2"
                            className="animate-ping"
                            style={{ animationDuration: '5s' }}
                        />
                    </svg>
                </div>
            );
        }
        // Group 6xx: Snow
        else if (id >= 600 && id < 700) {
            label = 'Snowy';
            icon = (
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-cyan-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <svg
                        className="w-full h-full text-cyan-400 animate-spin"
                        style={{ animationDuration: '15s' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m12.728 0L6.343 6.343"
                        />
                    </svg>
                </div>
            );
        }
        // Group 7xx: Atmosphere (Fog, Mist, etc.)
        else if (id >= 700 && id < 800) {
            label = 'Foggy';
            icon = (
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-gray-300 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <svg
                        className="w-full h-full text-gray-400 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 15h18M3 10h18M3 20h18"
                        />
                    </svg>
                </div>
            );
        }
        // Group 800: Clear
        else if (id === 800) {
            label = 'Sunny & Clear';
            // Icon is already default
        }
        // Group 80x: Clouds
        else if (id > 800) {
            label = 'Partly Cloudy';
            icon = (
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-gray-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <svg
                        className="w-full h-full text-blue-400 animate-bounce"
                        style={{ animationDuration: '3s' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                        {isDay === 1 && (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                className="text-orange-400 origin-center scale-75 -translate-y-2 translate-x-2"
                            />
                        )}
                    </svg>
                </div>
            );
        }

        return { label, icon };
    };

    const weatherDetails = weather
        ? getWeatherDetails(weather.weather_id, weather.is_day)
        : getWeatherDetails(800, 1);

    return (
        <div className="relative overflow-hidden">
            {/*
             * Main Container
             * Centers content and handles padding for different screen sizes.
             */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-10 lg:pt-10 xl:pt-12 lg:pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                    {/* Left Column: Text Content and CTAs */}
                    <div className="flex flex-col justify-center text-center lg:text-left lg:-mt-8 xl:-mt-16">
                        <div className="space-y-6">
                            {/* Badge: Small highlight text */}
                            <div className="inline-flex items-center justify-center lg:justify-start">
                                <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold tracking-wide uppercase">
                                    {t('weatherApp') ||
                                        'Canary Islands Forecast'}
                                </span>
                            </div>

                            {/* Main Heading: Large, bold text with gradient effect */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                                {t('welcomeTo')} <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-accent-blue-300 dark:from-blue-400 dark:to-teal-300">
                                    {t('canaryWeather')}
                                </span>
                            </h1>

                            {/* Description: Subtext explaining the value proposition */}
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                {t('discoverWeather')}
                            </p>

                            {/* Action Buttons: Navigation links */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                {/* Map Button: Primary action */}
                                <button
                                    onClick={() => navigate('/map')}
                                    className="group relative px-8 py-4 bg-brand-primary hover:bg-blue-700 text-white rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex justify-center items-center"
                                    aria-label="Navigate to Map"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t('maps')}
                                        {/* Icon: Arrow/Map icon */}
                                        <svg
                                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                {/* About Us Button: Secondary action */}
                                <button
                                    onClick={() => navigate('/aboutus')}
                                    className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                    aria-label="Navigate to About Us"
                                >
                                    {t('aboutUs')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Weather Composition */}
                    <div className="flex justify-center lg:justify-end relative perspective-1000">
                        {/* Decorative Background Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

                        {/*
                         * Main Weather Card
                         * A glassmorphism-style card representing a live weather dashboard.
                         * Now displays real-time data.
                         */}
                        <div className="relative w-full max-w-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 transform lg:rotate-y-12 hover:rotate-0 transition-all duration-700 ease-out group">
                            {error && (
                                <div className="absolute top-0 left-0 w-full bg-red-500/80 text-white text-xs p-2 text-center rounded-t-3xl z-10">
                                    {error}
                                </div>
                            )}

                            {/* Card Header: Location & Time */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-brand-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        {locationName.city}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">
                                        {locationName.region}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wide">
                                    Live
                                </span>
                            </div>

                            {/* Card Body: Main Weather Icon & Temp */}
                            <div className="flex flex-col items-center justify-center py-4">
                                {/* Animated Weather Icon */}
                                {loading ? (
                                    <div className="w-32 h-32 flex items-center justify-center mb-4">
                                        <Skeleton
                                            variant="circular"
                                            className="w-24 h-24"
                                        />
                                    </div>
                                ) : (
                                    weatherDetails.icon
                                )}

                                <div className="text-6xl font-bold text-gray-900 dark:text-white tracking-tighter flex items-center justify-center">
                                    {loading ? (
                                        <Skeleton className="w-32 h-16" />
                                    ) : (
                                        <>
                                            {Math.round(weather?.temp)}
                                            <span className="text-4xl align-top text-brand-primary">
                                                °C
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="text-xl font-medium text-gray-600 dark:text-gray-300 mt-2 capitalize w-full flex justify-center">
                                    {loading ? (
                                        <Skeleton className="w-24 h-6" />
                                    ) : (
                                        weather?.description ||
                                        weatherDetails.label
                                    )}
                                </div>
                            </div>

                            {/* Card Footer: Mini Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-center flex flex-col items-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                                        Wind
                                    </p>
                                    {loading ? (
                                        <Skeleton className="w-12 h-5" />
                                    ) : (
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {Math.round(weather?.wind_speed)}{' '}
                                            km/h
                                        </p>
                                    )}
                                </div>
                                <div className="text-center border-l border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                                        Humidity
                                    </p>
                                    {loading ? (
                                        <Skeleton className="w-12 h-5" />
                                    ) : (
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {Math.round(weather?.humidity)}%
                                        </p>
                                    )}
                                </div>
                                <div className="text-center border-l border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                                        UV
                                    </p>
                                    {loading ? (
                                        <Skeleton className="w-12 h-5" />
                                    ) : (
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            High
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Floating Elements (Decorations) */}
                            <div
                                className="absolute -right-12 top-1/4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl animate-bounce hidden lg:block"
                                style={{ animationDuration: '3s' }}
                            >
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                    />
                                </svg>
                            </div>
                            <div
                                className="absolute -left-8 bottom-1/4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl animate-bounce hidden lg:block"
                                style={{
                                    animationDuration: '4s',
                                    animationDelay: '1s',
                                }}
                            >
                                <span
                                    className="text-2xl"
                                    role="img"
                                    aria-label="wave"
                                >
                                    🌊
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AIAssistant weather={weather} />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Stats Component (Enhanced).
 *
 * Displays detailed environmental metrics for the current location.
 * Replaces the static stats with live data: Wind, Humidity, Visibility, Pressure, and Sun Cycle.
 *
 * @param {Object} props
 * @param {Object} props.coords - { lat, lon } coordinates.
 */
export default function Stats({ coords }) {
    const { t } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!coords) return;

        const fetchWeather = async () => {
            try {
                const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`,
                );
                const data = await res.json();
                setWeather(data);
            } catch (error) {
                console.error('Failed to fetch weather stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [coords]);

    if (loading || !weather) return null;

    // Helper to format time
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Sun Cycle Calculation
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const now = Date.now() / 1000;

    // Calculate progress (0 to 1)
    let progress = 0;
    if (now > sunrise && now < sunset) {
        progress = (now - sunrise) / (sunset - sunrise);
    } else if (now >= sunset) {
        progress = 1;
    }

    // SVG Arc Logic
    // Semi-circle from 180 deg to 0 deg (left to right)
    // We map progress 0..1 to angle -180..0 (degrees) for standard trig,
    // but for SVG path drawing we need coordinates.
    // Center (60, 60), Radius 40.
    // Angle: Start at PI (left), End at 0 (right).
    // Current Angle = PI - (progress * PI)

    const r = 40;
    const cx = 60;
    const cy = 60;
    const currentAngle = Math.PI - progress * Math.PI;
    const sunX = cx + r * Math.cos(currentAngle);
    const sunY = cy - r * Math.sin(currentAngle); // Subtract because SVG Y is down

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Wind Card */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-500">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t('wind') || 'Wind'}
                        </span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {(weather.wind.speed * 3.6).toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                                km/h
                            </span>
                        </div>
                        {/* Wind Direction Compass */}
                        <div className="relative w-12 h-12 border-2 border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center">
                            <div className="absolute top-0 text-[8px] text-gray-400">
                                N
                            </div>
                            <svg
                                className="w-6 h-6 text-blue-500 transform transition-transform duration-1000"
                                style={{
                                    transform: `rotate(${weather.wind.deg}deg)`,
                                }}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L4.5 20.29a.5.5 0 0 0 .65.65L12 17.25l6.85 3.69a.5.5 0 0 0 .65-.65L12 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Humidity Card */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-500">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t('humidity') || 'Humidity'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {weather.main.humidity}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                                %
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${weather.main.humidity}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                            Dew point:{' '}
                            {(
                                weather.main.temp -
                                (100 - weather.main.humidity) / 5
                            ).toFixed(1)}
                            °
                        </span>
                    </div>
                </div>

                {/* Visibility & Pressure Split Card */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-500">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    {t('visibility') || 'Visibility'}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {(weather.visibility / 1000).toFixed(1)} km
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-500">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    {t('pressure') || 'Pressure'}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {weather.main.pressure} hPa
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sun Cycle Utility - The "Cool Feature" */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl border border-orange-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                            {t('sunCycle') || 'Sun Cycle'}
                        </span>
                        {/* Live Time Badge */}
                        <span className="text-xs font-mono bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md text-orange-700 dark:text-orange-400">
                            {new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    <div className="flex justify-center items-end h-24 relative z-10 mt-2">
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 120 60"
                        >
                            {/* Arc Path */}
                            <path
                                d="M 10 60 A 50 50 0 0 1 110 60"
                                fill="none"
                                stroke="currentColor"
                                className="text-orange-200 dark:text-gray-600"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />

                            {/* Sun Icon moving along path */}
                            <g transform={`translate(${sunX}, ${sunY})`}>
                                <circle
                                    r="6"
                                    className="text-orange-500"
                                    fill="currentColor"
                                />
                                <circle
                                    r="10"
                                    className="text-orange-400 animate-pulse"
                                    fill="currentColor"
                                    fillOpacity="0.3"
                                />
                            </g>
                        </svg>

                        {/* Horizon Line */}
                        <div className="absolute bottom-0 w-full h-px bg-orange-200 dark:bg-gray-600"></div>
                    </div>

                    <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 relative z-10">
                        <div className="flex flex-col items-start">
                            <span>Sunrise</span>
                            <span className="text-gray-900 dark:text-white">
                                {formatTime(sunrise)}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span>Sunset</span>
                            <span className="text-gray-900 dark:text-white">
                                {formatTime(sunset)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

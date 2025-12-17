import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


export default function Stats({ coords }) {
    const { t } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [stars, setStars] = useState([]);

    useEffect(() => {
        // Generate random stars only once to avoid re-renders causing jumps
        const newStars = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 70}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() > 0.7 ? '2px' : '1px',
            opacity: Math.random() * 0.5 + 0.3,
            duration: `${Math.random() * 3 + 2}s`,
            delay: `${Math.random() * 5}s`
        }));
        setStars(newStars);

        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const now = currentTime / 1000;
    const isDay = now >= sunrise && now <= sunset;

    let progress = 0;
    
    if (isDay) {
        progress = (now - sunrise) / (sunset - sunrise);
    } else {
        // Night progress logic
        const dayDuration = sunset - sunrise;
        const nightDuration = 86400 - dayDuration;
        
        if (now > sunset) {
            // Evening/Early night
            progress = (now - sunset) / nightDuration;
        } else {
            // Morning/Late night (before sunrise)
            // Time since yesterday's sunset (approximate)
            progress = (now - (sunset - 86400)) / nightDuration;
        }
    }

    // Clamp progress
    progress = Math.max(0, Math.min(1, progress));

    
    
    
    
    
    
    

    const r = 40;
    const cx = 60;
    const cy = 60;
    const currentAngle = Math.PI - progress * Math.PI;
    const sunX = cx + r * Math.cos(currentAngle);
    const sunY = cy - r * Math.sin(currentAngle); 

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {}
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
                        {}
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

                {}
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

                {}
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

                {}
                <div className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden transition-all duration-1000 ${
                    isDay 
                        ? 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 border-orange-100 dark:border-gray-700' 
                        : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-900 text-white'
                }`}>
                    {/* Stars effect for night */}
                    {!isDay && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <style>
                                {`
                                    @keyframes shooting-star {
                                        0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
                                        20% { transform: translateX(200px) translateY(200px) rotate(-45deg); opacity: 0; }
                                        100% { transform: translateX(200px) translateY(200px) rotate(-45deg); opacity: 0; }
                                    }
                                    .shooting-star {
                                        position: absolute;
                                        top: -10%;
                                        left: 50%;
                                        width: 100px;
                                        height: 2px;
                                        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,0));
                                        animation: shooting-star 8s infinite ease-in-out;
                                        animation-delay: 3s;
                                        opacity: 0;
                                    }
                                `}
                            </style>
                            {/* Twinkling Stars */}
                            {stars.map((star) => (
                                <div
                                    key={star.id}
                                    className="absolute bg-white rounded-full animate-pulse"
                                    style={{
                                        top: star.top,
                                        left: star.left,
                                        width: star.size,
                                        height: star.size,
                                        opacity: star.opacity,
                                        animationDuration: star.duration,
                                        animationDelay: star.delay
                                    }}
                                />
                            ))}
                            {/* Shooting Star */}
                            <div className="shooting-star"></div>
                        </div>
                    )}

                    {/* Clouds effect for day */}
                    {isDay && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <style>
                                {`
                                    @keyframes float-cloud {
                                        0% { transform: translateX(-100%); opacity: 0; }
                                        10% { opacity: 0.6; }
                                        90% { opacity: 0.6; }
                                        100% { transform: translateX(400%); opacity: 0; }
                                    }
                                    .cloud-shape {
                                        position: absolute;
                                        background: rgba(255, 255, 255, 0.6);
                                        border-radius: 50px;
                                        animation: float-cloud linear infinite;
                                    }
                                    .cloud-shape::after {
                                        content: '';
                                        position: absolute;
                                        top: -50%;
                                        left: 15%;
                                        width: 60%;
                                        height: 100%;
                                        background: inherit;
                                        border-radius: 50%;
                                    }
                                    .cloud-shape::before {
                                        content: '';
                                        position: absolute;
                                        top: -30%;
                                        right: 15%;
                                        width: 40%;
                                        height: 80%;
                                        background: inherit;
                                        border-radius: 50%;
                                    }
                                `}
                            </style>
                            <div className="cloud-shape w-16 h-6 top-4" style={{ animationDuration: '25s', animationDelay: '0s' }}></div>
                            <div className="cloud-shape w-12 h-4 top-12" style={{ animationDuration: '35s', animationDelay: '5s' }}></div>
                            <div className="cloud-shape w-20 h-8 top-8" style={{ animationDuration: '30s', animationDelay: '12s' }}></div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className={`text-sm font-medium ${isDay ? 'text-orange-800 dark:text-orange-300' : 'text-indigo-200'}`}>
                            {isDay ? (t('sunCycle') || 'Sun Cycle') : (t('moonCycle') || 'Moon Cycle')}
                        </span>
                        {}
                        <span className={`text-xs font-mono px-2 py-1 rounded-md ${
                            isDay 
                                ? 'bg-white/50 dark:bg-black/20 text-orange-700 dark:text-orange-400' 
                                : 'bg-white/10 text-indigo-200'
                        }`}>
                            {new Date(currentTime).toLocaleTimeString([], {
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
                            {}
                            <path
                                d="M 10 60 A 50 50 0 0 1 110 60"
                                fill="none"
                                stroke="currentColor"
                                className={isDay ? "text-orange-200 dark:text-gray-600" : "text-indigo-800"}
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />

                            {}
                            <g transform={`translate(${sunX}, ${sunY})`}>
                                {isDay ? (
                                    <>
                                        {/* Sun Rays Animation */}
                                        <g className="animate-[spin_10s_linear_infinite]">
                                            {[...Array(8)].map((_, i) => (
                                                <line
                                                    key={i}
                                                    x1="0"
                                                    y1="-14"
                                                    x2="0"
                                                    y2="-18"
                                                    className="stroke-orange-400"
                                                    strokeWidth="2"
                                                    transform={`rotate(${i * 45})`}
                                                />
                                            ))}
                                        </g>
                                        <circle
                                            r="8"
                                            className="text-orange-500"
                                            fill="currentColor"
                                        />
                                        <circle
                                            r="12"
                                            className="text-orange-400 animate-pulse"
                                            fill="currentColor"
                                            fillOpacity="0.3"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <circle
                                            r="12"
                                            className="text-indigo-400 animate-pulse"
                                            fill="currentColor"
                                            fillOpacity="0.2"
                                        />
                                        <path 
                                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                                            fill="currentColor" 
                                            className="text-indigo-200"
                                            transform="translate(-12, -12) scale(1)" 
                                        />
                                    </>
                                )}
                            </g>
                        </svg>

                        {}
                        <div className={`absolute bottom-0 w-full h-px ${isDay ? 'bg-orange-200 dark:bg-gray-600' : 'bg-indigo-900'}`}></div>
                    </div>

                    <div className={`flex justify-between text-xs font-medium mt-2 relative z-10 ${isDay ? 'text-gray-500 dark:text-gray-400' : 'text-indigo-300'}`}>
                        <div className="flex flex-col items-start">
                            <span>{t('sunrise') || 'Sunrise'}</span>
                            <span className={isDay ? "text-gray-900 dark:text-white" : "text-white"}>
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

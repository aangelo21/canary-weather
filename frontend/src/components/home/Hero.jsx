import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '../common/Skeleton';
import AIAssistant from './AIAssistant';


export default function Hero({ coords }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState({
        city: 'Locating...',
        region: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const fetchWeatherData = useCallback(
        async (lat, lon) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
                );
                const data = await response.json();

                
                setWeather({
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    wind_speed: data.wind.speed, 
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

    
    useEffect(() => {
        if (coords) {
            fetchWeatherData(coords.lat, coords.lon);
            fetchLocationName(coords.lat, coords.lon);
        }
    }, [coords, fetchWeatherData, fetchLocationName]);

    
    useEffect(() => {
        if (!coords) return;

        const intervalId = setInterval(() => {
            fetchWeatherData(coords.lat, coords.lon);
        }, 300000); 

        return () => clearInterval(intervalId);
    }, [coords, fetchWeatherData]);

    
    const getWeatherDesign = (id, isDay) => {
        let label = 'Sunny';
        let emoji = '☀️';
        let bgGradient = 'from-orange-400 to-amber-500';
        let animation = 'animate-[spin_12s_linear_infinite]';
        let glowColor = 'bg-orange-400';

        if (id >= 200 && id < 300) {
            label = 'Thunderstorm';
            emoji = '⛈️';
            bgGradient = 'from-slate-700 to-purple-800';
            animation = 'animate-pulse';
            glowColor = 'bg-purple-500';
        } else if (id >= 300 && id < 600) {
            label = 'Rainy';
            emoji = '🌧️';
            bgGradient = 'from-blue-400 to-cyan-500';
            animation = 'animate-bounce';
            glowColor = 'bg-blue-400';
        } else if (id >= 600 && id < 700) {
            label = 'Snowy';
            emoji = '❄️';
            bgGradient = 'from-slate-100 to-blue-200';
            animation = 'animate-bounce';
            glowColor = 'bg-cyan-200';
        } else if (id >= 700 && id < 800) {
            label = 'Foggy';
            emoji = '🌫️';
            bgGradient = 'from-gray-300 to-slate-400';
            animation = 'animate-pulse';
            glowColor = 'bg-gray-300';
        } else if (id === 800) {
            label = isDay ? 'Clear Sky' : 'Clear Night';
            emoji = isDay ? '☀️' : '🌙';
            bgGradient = isDay 
                ? 'from-yellow-400 to-orange-500' 
                : 'from-blue-900 to-indigo-900';
            animation = isDay ? 'animate-[spin_20s_linear_infinite]' : 'animate-pulse';
            glowColor = isDay ? 'bg-orange-400' : 'bg-indigo-500';
        } else if (id > 800) {
            label = 'Cloudy';
            emoji = isDay ? '⛅' : '☁️';
            bgGradient = 'from-gray-400 to-blue-400';
            animation = 'animate-pulse';
            glowColor = 'bg-gray-400';
        }

        return { label, emoji, bgGradient, animation, glowColor };
    };

    const design = weather
        ? getWeatherDesign(weather.weather_id, weather.is_day)
        : getWeatherDesign(800, 1);

    return (
        <div className="relative overflow-hidden">
            {}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-10 lg:pt-10 xl:pt-12 lg:pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                    {}
                    <div className="flex flex-col justify-center text-center lg:text-left lg:-mt-8 xl:-mt-16">
                        <div className="space-y-6">
                            {}
                            <div className="inline-flex items-center justify-center lg:justify-start">
                                <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold tracking-wide uppercase">
                                    {t('weatherApp') ||
                                        'Canary Islands Forecast'}
                                </span>
                            </div>

                            {}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                                {t('welcomeTo')} <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-accent-blue-300 dark:from-blue-400 dark:to-teal-300">
                                    {t('canaryWeather')}
                                </span>
                            </h1>

                            {}
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                {t('discoverWeather')}
                            </p>

                            {}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                {}
                                <button
                                    onClick={() => navigate('/map')}
                                    className="group relative px-8 py-4 bg-brand-primary hover:bg-blue-700 text-white rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex justify-center items-center"
                                    aria-label="Navigate to Map"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t('maps')}
                                        {}
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

                                {}
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

                    {}
                    <div className="flex justify-center lg:justify-end relative perspective-1000 z-20">
                        {/* Background Decoration */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr ${design.bgGradient} rounded-full blur-[100px] -z-10 opacity-60 transition-colors duration-1000`}></div>

                        {/* Glass Card */}
                        <div className="relative w-full max-w-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-[2.5rem] shadow-2xl p-8 transform lg:rotate-y-6 hover:rotate-0 transition-all duration-700 ease-out group">
                            {error && (
                                <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-xs font-bold py-2 text-center rounded-t-[2.5rem] z-10">
                                    {error}
                                </div>
                            )}

                            {/* Header: Location & Live Badge */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-1">{locationName.city}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-7 line-clamp-1">
                                        {locationName.region}
                                    </p>
                                </div>
                                <span className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-lg shadow-green-500/30">
                                    Live
                                </span>
                            </div>

                            {/* Main Weather Display */}
                            <div className="flex flex-col items-center justify-center py-2 relative">
                                {/* Large Emoji Icon */}
                                {loading ? (
                                    <div className="w-40 h-40 flex items-center justify-center mb-4">
                                        <Skeleton variant="circular" className="w-32 h-32" />
                                    </div>
                                ) : (
                                    <div className="relative w-full flex justify-center py-4 my-2">
                                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${design.glowColor} rounded-full blur-[60px] opacity-40 animate-pulse`}></div>
                                         <span className={`text-[8rem] leading-none drop-shadow-2xl select-none filter ${design.animation}`} role="img" aria-label={design.label}>
                                            {design.emoji}
                                         </span>
                                    </div>
                                )}

                                <div className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center justify-center mt-4">
                                    {loading ? (
                                        <Skeleton className="w-32 h-20" />
                                    ) : (
                                        <>
                                            {Math.round(weather?.temp)}
                                            <span className="text-4xl align-top text-gray-400 dark:text-gray-500 font-light mt-2 ml-1">
                                                °C
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="text-2xl font-medium text-gray-500 dark:text-gray-400 mt-1 capitalize w-full flex justify-center">
                                    {loading ? (
                                        <Skeleton className="w-24 h-6" />
                                    ) : (
                                        weather?.description || design.label
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
                                <div className="text-center flex flex-col items-center group/stat">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                        Wind
                                    </p>
                                    {loading ? (
                                        <Skeleton className="w-12 h-6" />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 dark:text-white group-hover/stat:scale-110 transition-transform">
                                            {Math.round(weather?.wind_speed)} <span className="text-sm font-normal text-gray-500">km/h</span>
                                        </p>
                                    )}
                                </div>
                                <div className="text-center border-l border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center group/stat">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                        Humidity
                                    </p>
                                    {loading ? (
                                        <Skeleton className="w-12 h-6" />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 dark:text-white group-hover/stat:scale-110 transition-transform">
                                            {Math.round(weather?.humidity)}<span className="text-sm font-normal text-gray-500">%</span>
                                        </p>
                                    )}
                                </div>
                                <div className="text-center border-l border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center group/stat">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                        UV
                                    </p>
                                    {loading ? (
                                        <Skeleton className="w-12 h-6" />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-900 dark:text-white group-hover/stat:scale-110 transition-transform">
                                            High
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -right-8 top-20 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl animate-bounce delay-700 hidden lg:block z-30">
                                <span className="text-2xl">☁️</span>
                            </div>
                            <div className="absolute -left-6 bottom-32 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl animate-bounce delay-1000 hidden lg:block z-30">
                                <span className="text-2xl">🌊</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AIAssistant weather={weather} />
        </div>
    );
}

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from '../common/Skeleton';


export default function HourlyForecast({ coords, compact = false }) {
    const { t } = useTranslation();
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                scrollContainerRef.current;
            setShowLeftScroll(scrollLeft > 0);
            setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            
            handleScroll();
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, [forecast]);

    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const fetchForecast = async () => {
        if (!coords) return;
        
        if (forecast.length === 0) setLoading(true);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
            );

            if (!response.ok) throw new Error('Failed to fetch forecast');

            const data = await response.json();

            
            
            const next24Hours = data.list.slice(0, 10).map((item) => ({
                dt: item.dt,
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                description: item.weather[0].main,
                
                time: new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                isDay: item.sys.pod === 'd',
                pop: Math.round(item.pop * 100), 
                wind: Math.round(item.wind.speed),
            }));

            setForecast(next24Hours);
            setError(null);
        } catch (err) {
            console.error('Forecast Error:', err);
            setError('Could not load forecast.');
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchForecast();
        const interval = setInterval(fetchForecast, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [coords, OPENWEATHER_API_KEY]);

    
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= 300;
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += 300;
        }
    };

    
    const graphData = useMemo(() => {
        if (forecast.length < 2)
            return { linePath: '', areaPath: '', points: [] };

        const temps = forecast.map((f) => f.temp);
        const maxTemp = Math.max(...temps) + 2;
        const minTemp = Math.min(...temps) - 2;
        const range = maxTemp - minTemp || 1;

        const width = 120; 
        const height = compact ? 60 : 80; 
        const paddingY = compact ? 10 : 20; 

        const points = forecast.map((f, i) => {
            const x = i * width + width / 2;
            const normalizedTemp = (f.temp - minTemp) / range;
            
            const y =
                height -
                paddingY -
                normalizedTemp * (height - paddingY * 2) +
                paddingY / 2;
            return { x, y, temp: f.temp };
        });

        
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            const cp2y = p1.y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }

        
        const areaPath = `${d} L ${points[points.length - 1].x} ${height + 50} L ${points[0].x} ${height + 50} Z`;

        return { linePath: d, areaPath, points };
    }, [forecast, compact]);

    if (!coords && !loading) return null;

    
    const getWeatherIcon = (code) => {
        const isDay = code.includes('d');
        const type = code.slice(0, 2);
        const sizeClass = compact ? 'w-8 h-8' : 'w-12 h-12';

        switch (type) {
            case '01': 
                return isDay ? (
                    <svg
                        className={`${sizeClass} text-orange-400 animate-spin-slow`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="5"
                            fill="currentColor"
                            fillOpacity="0.2"
                        />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                ) : (
                    <svg
                        className={`${sizeClass} text-blue-200`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                            fill="currentColor"
                            fillOpacity="0.2"
                        />
                    </svg>
                );
            case '02': 
                return (
                    <svg
                        className={`${sizeClass}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M16.5 19a4.5 4.5 0 1 1-1.41-8.77A5.5 5.5 0 1 1 12.5 0a5.5 5.5 0 0 1 5.08 3.38"
                            className="text-gray-400"
                            fill="currentColor"
                            fillOpacity="0.1"
                        />
                        {isDay && (
                            <circle
                                cx="18"
                                cy="5"
                                r="3"
                                className="text-orange-400"
                                fill="currentColor"
                            />
                        )}
                    </svg>
                );
            case '03': 
            case '04': 
                return (
                    <svg
                        className={`${sizeClass} text-gray-400`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M17.5 19c0 2.5-2 4.5-4.5 4.5S8.5 21.5 8.5 19c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5z"
                            fill="currentColor"
                            fillOpacity="0.2"
                        />
                        <path d="M17.5 19a4.5 4.5 0 0 0-1.41-8.77A5.5 5.5 0 0 0 12.5 0a5.5 5.5 0 0 0-5.08 3.38A4.5 4.5 0 0 0 3.5 10a4.5 4.5 0 0 0 4.5 4.5" />
                    </svg>
                );
            case '09': 
            case '10': 
                return (
                    <svg
                        className={`${sizeClass} text-blue-500`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M17.5 15a4.5 4.5 0 1 0-1.41-8.77A5.5 5.5 0 0 0 12.5 0a5.5 5.5 0 0 0-5.08 3.38A4.5 4.5 0 0 0 3.5 10a4.5 4.5 0 0 0 4.5 4.5"
                            className="text-gray-400"
                            fill="currentColor"
                            fillOpacity="0.1"
                        />
                        <path
                            d="M8 17v2M12 17v2M16 17v2"
                            className="animate-bounce"
                            style={{ animationDuration: '1.5s' }}
                        />
                    </svg>
                );
            case '11': 
                return (
                    <svg
                        className={`${sizeClass} text-purple-500`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M17.5 15a4.5 4.5 0 1 0-1.41-8.77A5.5 5.5 0 0 0 12.5 0a5.5 5.5 0 0 0-5.08 3.38A4.5 4.5 0 0 0 3.5 10a4.5 4.5 0 0 0 4.5 4.5"
                            className="text-gray-500"
                            fill="currentColor"
                            fillOpacity="0.1"
                        />
                        <path
                            d="M13 15l-2 4h3l-2 4"
                            className="text-yellow-400 animate-pulse"
                            fill="currentColor"
                        />
                    </svg>
                );
            case '13': 
                return (
                    <svg
                        className={`${sizeClass} text-cyan-300`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" />
                        <path
                            d="M17.5 13a4.5 4.5 0 1 0-1.41-8.77A5.5 5.5 0 0 0 12.5 0a5.5 5.5 0 0 0-5.08 3.38A4.5 4.5 0 0 0 3.5 8a4.5 4.5 0 0 0 4.5 4.5"
                            className="text-gray-300"
                            fill="currentColor"
                            fillOpacity="0.1"
                        />
                    </svg>
                );
            default: 
                return (
                    <svg
                        className={`${sizeClass} text-gray-400`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M5 16h14M5 20h14" />
                        {isDay && (
                            <circle
                                cx="12"
                                cy="6"
                                r="2"
                                className="text-orange-300"
                                fill="currentColor"
                            />
                        )}
                    </svg>
                );
        }
    };

    const containerClasses = compact
        ? 'w-full relative z-10'
        : 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20 mb-16';

    const cardClasses = compact
        ? 'bg-transparent'
        : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg rounded-3xl overflow-hidden';

    return (
        <div className={containerClasses}>
            <div className={cardClasses}>
                {}
                {!compact && (
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    {t('hourlyForecastTitle') || '24h Forecast'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    {t('liveUpdates') || 'Updated just now'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {}
                <div
                    className={`relative ${compact ? 'h-40' : 'h-64'} ${!compact && 'bg-white dark:bg-gray-900'} group/container`}
                >
                    {}
                    {compact && !loading && !error && (
                        <>
                            <button
                                onClick={scrollLeft}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 ${showLeftScroll ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={scrollRight}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 ${showRightScroll ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                            {}
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftScroll ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <div
                                className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showRightScroll ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </>
                    )}

                    {loading ? (
                        <div className="flex items-center gap-6 px-8 h-full overflow-hidden">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-4 min-w-[100px]"
                                >
                                    <Skeleton className="w-16 h-4 rounded-full" />
                                    <Skeleton
                                        variant="circular"
                                        className="w-12 h-12"
                                    />
                                    <Skeleton className="w-12 h-8 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
                            <svg
                                className="w-8 h-8 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span className="text-sm font-medium">{error}</span>
                            <button
                                onClick={fetchForecast}
                                className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="overflow-x-auto scrollbar-hide h-full flex items-stretch relative select-none cursor-grab active:cursor-grabbing scroll-smooth"
                        >
                            {}
                            <div
                                className={`absolute ${compact ? 'top-[60px]' : 'top-[90px]'} left-0 ${compact ? 'h-[60px]' : 'h-[100px]'} pointer-events-none z-0`}
                                style={{ width: `${forecast.length * 120}px` }}
                            >
                                <svg className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient
                                            id="areaGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#3b82f6"
                                                stopOpacity={
                                                    compact ? '0.1' : '0.2'
                                                }
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#3b82f6"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="lineGradient"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#0ea5e9"
                                            />
                                            <stop
                                                offset="50%"
                                                stopColor="#3b82f6"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#6366f1"
                                            />
                                        </linearGradient>
                                        <filter
                                            id="glow"
                                            x="-20%"
                                            y="-20%"
                                            width="140%"
                                            height="140%"
                                        >
                                            <feGaussianBlur
                                                stdDeviation="2"
                                                result="blur"
                                            />
                                            <feComposite
                                                in="SourceGraphic"
                                                in2="blur"
                                                operator="over"
                                            />
                                        </filter>
                                    </defs>

                                    {}
                                    <path
                                        d={graphData.areaPath}
                                        fill="url(#areaGradient)"
                                        className="transition-all duration-1000 ease-out"
                                    />

                                    {}
                                    <path
                                        d={graphData.linePath}
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth={compact ? '2' : '3'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#glow)"
                                        className="transition-all duration-1000 ease-out"
                                    />

                                    {}
                                    {graphData.points.map((p, i) => (
                                        <line
                                            key={`line-${i}`}
                                            x1={p.x}
                                            y1={p.y}
                                            x2={p.x}
                                            y2={150}
                                            stroke="currentColor"
                                            className="text-gray-200 dark:text-gray-700 opacity-0 group-hover:opacity-50 transition-opacity"
                                            strokeDasharray="4 4"
                                        />
                                    ))}
                                </svg>
                            </div>

                            {}
                            {forecast.map((item, index) => (
                                <div
                                    key={item.dt}
                                    className={`group flex-none w-[120px] flex flex-col items-center justify-between ${compact ? 'py-2' : 'py-6'} relative z-10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-300`}
                                >
                                    {}
                                    <div className="flex flex-col items-center gap-1">
                                        <span
                                            className={`font-semibold text-gray-500 dark:text-gray-400 group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
                                        >
                                            {item.time}
                                        </span>

                                        <div className="relative transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                                            {getWeatherIcon(item.icon)}

                                            {}
                                            {item.pop > 0 && (
                                                <div className="absolute -bottom-2 -right-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center shadow-sm border border-blue-200 dark:border-blue-700 z-10">
                                                    <svg
                                                        className="w-2.5 h-2.5 mr-0.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                        />
                                                    </svg>
                                                    {item.pop}%
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {}
                                    <div className="flex flex-col items-center mt-auto pt-8">
                                        <span
                                            className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-800 dark:text-white group-hover:scale-110 transition-transform`}
                                        >
                                            {item.temp}°
                                        </span>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                                            <svg
                                                className="w-3 h-3"
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
                                            {item.wind} km/h
                                        </div>
                                    </div>

                                    {}
                                    <div className="absolute inset-y-4 left-1/2 w-px bg-gradient-to-b from-transparent via-blue-200 dark:via-blue-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Import useNavigate hook from React Router for programmatic navigation
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DestinationCarousel from "../components/DestinationCarousel";

// Home page component - the landing page of the Canary Weather application
function Home() {
    // Hook to navigate to different routes
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        // Main container with white background
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
            
            {/* Hero Section - main promotional area */}
            <div className="relative overflow-hidden">
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left column - Hero text content */}
                        <div className="flex flex-col justify-center text-center lg:text-left">
                            <div className="space-y-6">
                                {/* Badge */}
                                <div className="inline-flex items-center justify-center lg:justify-start">
                                    <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold tracking-wide uppercase">
                                        {t('weatherApp') || "Canary Islands Forecast"}
                                    </span>
                                </div>

                                {/* Main heading welcoming users to Canary Weather */}
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                                    {t('welcomeTo')} <br />
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-accent-blue-300 dark:from-blue-400 dark:to-teal-300">
                                        {t('canaryWeather')}
                                    </span>
                                </h1>

                                {/* Descriptive paragraph about the app's features */}
                                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    {t('discoverWeather')}
                                </p>

                                {/* Call-to-action buttons for navigation */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                    {/* Button to navigate to the map page */}
                                    <button
                                        onClick={() => navigate("/map")}
                                        className="group relative px-8 py-4 bg-brand-primary hover:bg-blue-700 text-white rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {t('maps')}
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Button to navigate to about us page */}
                                    <button
                                        onClick={() => navigate("/aboutus")}
                                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        {t('aboutUs')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right column - hero image with phones */}
                        <div className="flex justify-center lg:justify-end relative">
                            <div className="relative w-full max-w-md lg:max-w-lg transform hover:scale-105 transition-transform duration-500">
                                {/* Abstract shapes behind image */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-blue-200/30 to-yellow-200/30 dark:from-blue-500/10 dark:to-yellow-500/10 rounded-full blur-2xl -z-10"></div>
                                
                                {/* Placeholder for phone mockup image */}
                                <div className="w-full aspect-square flex items-center justify-center">
                                    <img 
                                        src="/phone-mockup.png" 
                                        alt="Mobile phones showing weather app"
                                        className="w-full h-auto object-contain drop-shadow-2xl z-10"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.classList.remove('hidden');
                                            e.target.nextSibling.classList.add('flex');
                                        }}
                                    />
                                    {/* Fallback if image fails */}
                                    <div className="w-full h-96 bg-linear-to-br from-blue-500 to-cyan-400 rounded-3xl shadow-2xl hidden flex-col items-center justify-center p-8 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <svg className="w-24 h-24 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                        <span className="text-2xl font-bold text-center">{t('canaryWeather')}</span>
                                        <span className="text-blue-100 mt-2">{t('heroImage')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="bg-brand-primary/5 dark:bg-white/5 border-y border-brand-primary/10 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">22°C</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">{t('avgTemp') || "Avg. Temp"}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">3000+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">{t('sunHours') || "Sunshine Hours"}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">8</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">{t('islands') || "Islands"}</div>
                        </div>
                         <div>
                            <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">100%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">{t('reliable') || "Reliable"}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activities Section */}
            <div className="pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('forecastForYou') || "Forecast for you"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('lifestyleDesc') || "Whether you're catching waves or climbing peaks, get the precise data you need."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Surfing Card */}
                        <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-xl">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <div className="text-white mb-2">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('surfing') || "Surfing & Water Sports"}</h3>
                                <p className="text-gray-200 text-sm">{t('surfingDesc') || "Swell height, wind direction, and tide charts."}</p>
                            </div>
                        </div>

                        {/* Hiking Card */}
                        <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-xl">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <div className="text-white mb-2">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('hiking') || "Hiking & Trekking"}</h3>
                                <p className="text-gray-200 text-sm">{t('hikingDesc') || "Temperature at altitude and visibility forecasts."}</p>
                            </div>
                        </div>

                        {/* Stargazing Card */}
                        <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-xl">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <div className="text-white mb-2">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('stargazing') || "Stargazing"}</h3>
                                <p className="text-gray-200 text-sm">{t('stargazingDesc') || "Cloud coverage and moon phase for clear skies."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="pt-10 pb-16 bg-white dark:bg-gray-900">
                <DestinationCarousel />
            </div>
        </div>
    );
}

// Export the Home component as default
export default Home;
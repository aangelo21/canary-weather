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
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
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
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-accent-blue-300 dark:from-blue-400 dark:to-teal-300">
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
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-200/30 to-yellow-200/30 dark:from-blue-500/10 dark:to-yellow-500/10 rounded-full blur-2xl -z-10"></div>
                                
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
                                    <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl shadow-2xl hidden flex-col items-center justify-center p-8 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
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

            {/* Feature Cards Section */}
            <div className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('whyChooseUs') || "Why Choose Canary Weather?"}</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('featuresDesc') || "Everything you need to plan your perfect trip to the Canary Islands."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Array of feature cards with title, description, and icon */}
                        {[
                            {
                                title: t('responsive'),
                                text: t('responsiveDesc'),
                                color: "bg-yellow-400",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                )
                            },
                            {
                                title: t('windAlert'),
                                text: t('windAlertDesc'),
                                color: "bg-blue-400",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 0014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: t('locations'),
                                text: t('locationsDesc'),
                                color: "bg-green-400",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            }
                        ].map((card, i) => (
                            // Individual feature card
                            <div
                                key={i}
                                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Icon container */}
                                <div className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="text-white w-8 h-8">
                                        {card.icon}
                                    </div>
                                </div>
                                {/* Card title */}
                                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">{card.title}</h3>
                                {/* Card description */}
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="py-16 bg-gray-50 dark:bg-black/20">
                <DestinationCarousel />
            </div>
        </div>
    );
}

// Export the Home component as default
export default Home;
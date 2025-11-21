// Import useNavigate hook from React Router for programmatic navigation
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Home page component - the landing page of the Canary Weather application
function Home() {
    // Hook to navigate to different routes
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        // Main container with white background
        <div className="min-h-screen bg-white flex flex-col">
            {/* Hero Section - main promotional area */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left column - Hero text content */}
                    <div className="flex flex-col justify-center">
                        <div>
                            {/* Main heading welcoming users to Canary Weather */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                                {t('welcomeTo')}
                                <br />
                                <span className="block mt-1">{t('canaryWeather')}</span>
                            </h1>

                            {/* Descriptive paragraph about the app's features */}
                            <p className="mt-6 text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
                                {t('discoverWeather')}
                            </p>

                            {/* Call-to-action buttons for navigation */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                {/* Button to navigate to the map page */}
                                <button
                                    onClick={() => navigate("/map")}
                                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-accent-blue-200 text-white px-5 py-3 rounded-full font-semibold shadow"
                                >
                                    {t('maps')}
                                </button>

                                {/* Button to navigate to tides page */}
                                <button
                                    onClick={() => navigate("/tides")}
                                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-accent-blue-200 text-white px-5 py-3 rounded-full font-semibold shadow"
                                >
                                    {t('tidesLower')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right column - hero image with phones */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            {/* Placeholder for phone mockup image */}
                            <div className="w-full aspect-square flex items-center justify-center">
                                <img 
                                    src="/phone-mockup.png" 
                                    alt="Mobile phones showing weather app"
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-2xl hidden items-center justify-center">
                                    <span className="text-gray-400 text-lg">{t('heroImage')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="bg-white py-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Array of feature cards with title, description, and icon */}
                        {[
                            {
                                title: t('responsive'),
                                text: t('responsiveDesc'),
                                icon: (
                                    // Responsive design icon
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                )
                            },
                            {
                                title: t('windAlert'),
                                text: t('windAlertDesc'),
                                icon: (
                                    // Wind/alert icon
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 0014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            },
                            {
                                title: t('locations'),
                                text: t('locationsDesc'),
                                icon: (
                                    // Location pin icon
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            }
                        ].map((card, i) => (
                            // Individual feature card with yellow background
                            <div
                                key={i}
                                className="bg-yellow-400 rounded-xl p-6 shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                            >
                                {/* Icon container */}
                                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
                                    <div className="text-yellow-400">
                                        {card.icon}
                                    </div>
                                </div>
                                {/* Card title */}
                                <h3 className="font-bold text-lg mb-2 text-black">{card.title}</h3>
                                {/* Card description */}
                                <p className="text-sm text-black leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export the Home component as default
export default Home;
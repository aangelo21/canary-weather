// Import useNavigate hook from React Router for programmatic navigation
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Home page component - the landing page of the Canary Weather application
function Home() {
    // Hook to navigate to different routes
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        // Main container with full height and neutral background
        <div className="min-h-screen bg-neutral-4 flex flex-col">
            {/* Hero Section - main promotional area */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-12 grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                    {/* Left column - Hero text content */}
                    <div className="flex flex-col justify-center h-full">
                        <div>
                            {/* Main heading welcoming users to Canary Weather */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-1 leading-tight">
                                {t('welcomeTo')}
                                <br />
                                {t('canaryWeather')}
                            </h1>

                            {/* Descriptive paragraph about the app's features */}
                            <p className="mt-6 text-lg md:text-xl text-neutral-2 max-w-xl">
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

                                {/* Button to navigate to tides page (though route may not exist yet) */}
                                <button
                                    onClick={() => navigate("/tides")}
                                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-accent-blue-200 text-white px-5 py-3 rounded-full font-semibold shadow"
                                >
                                    {t('tides')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right column - placeholder for hero image */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-md lg:max-w-lg">
                            {/* Placeholder div for hero image or illustration */}
                            <div className="w-full h-80 bg-linear-to-br from-slate-100 to-white rounded-3xl shadow-xl flex items-center justify-center">
                                <span className="text-neutral-3">{t('heroImage')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

            {/* Feature cards section - highlights key app features */}
            <div className="flex justify-center pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {/* Array of feature cards with title, description, and icon */}
                    {[
                        {
                            title: t('responsive'),
                            text: t('responsiveDesc'),
                            icon: (
                                // Responsive design icon (sun with rays)
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42" stroke="#0f6fa8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="#0f6fa8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        },
                        {
                            title: t('windAlert'),
                            text: t('windAlertDesc'),
                            icon: (
                                // Wind/compass icon
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 12h18M12 3v18" stroke="#0f6fa8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        },
                        {
                            title: t('locations'),
                            text: t('locationsDesc'),
                            icon: (
                                // Star/location icon
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" stroke="#0f6fa8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        }
                    ].map((card, i) => (
                        // Individual feature card with hover effect
                        <div
                            key={i}
                            className="w-44 bg-brand-secondary rounded-xl p-4 shadow-[0_14px_30px_rgba(15,111,168,0.12)] flex flex-col items-center text-center gap-2 transform transition-transform hover:-translate-y-1"
                        >
                            {/* Icon container */}
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                {card.icon}
                            </div>
                            {/* Card title */}
                            <h3 className="font-bold text-sm">{card.title}</h3>
                            {/* Card description */}
                            <p className="text-xs text-black/90">{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export the Home component as default
export default Home;

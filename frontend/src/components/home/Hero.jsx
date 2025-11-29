import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Hero Component.
 *
 * This component renders the "Hero" section of the Home page, which is the first thing users see.
 * It is designed to be visually striking and informative, guiding users to key parts of the application.
 *
 * Features:
 * - **Responsive Layout**: Uses a grid system that stacks vertically on mobile (`grid-cols-1`) and side-by-side on large screens (`lg:grid-cols-2`).
 * - **Internationalization**: Uses `useTranslation` hook for multi-language support.
 * - **Navigation**: Provides buttons to navigate to the Map and About Us pages.
 * - **Visuals**: Includes a dynamic text gradient and a responsive image section.
 *
 * @returns {JSX.Element} The rendered Hero component.
 */
export default function Hero() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="relative overflow-hidden">
            {/* Main Container: Centers content and handles padding for different screen sizes */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-10 lg:pt-16 lg:pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Text Content and CTAs */}
                    <div className="flex flex-col justify-center text-center lg:text-left lg:-mt-16">
                        <div className="space-y-6">
                            {/* Badge: Small highlight text */}
                            <div className="inline-flex items-center justify-center lg:justify-start">
                                <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold tracking-wide uppercase">
                                    {t('weatherApp') || 'Canary Islands Forecast'}
                                </span>
                            </div>

                            {/* Main Heading: Large, bold text with gradient effect */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
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

                    {/* Right Column: Hero Image */}
                    <div className="flex justify-center lg:justify-center relative">
                        <div className="relative w-full max-w-xs lg:max-w-sm transform hover:scale-105 transition-transform duration-500">
                            {/* Image Container: Maintains aspect ratio */}
                            <div className="w-full aspect-square flex items-center justify-center">
                                <img
                                    src="/canary-weather-phone.png"
                                    alt="Mobile phones showing weather app"
                                    className="w-full h-auto object-contain drop-shadow-2xl z-10"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) {
                                            e.target.nextSibling.classList.remove('hidden');
                                            e.target.nextSibling.classList.add('flex');
                                        }
                                    }}
                                />
                                {/* Fallback if image fails */}
                                <div className="w-full h-96 bg-linear-to-br from-blue-500 to-cyan-400 rounded-3xl shadow-2xl hidden flex-col items-center justify-center p-8 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <svg
                                        className="w-24 h-24 mb-4 opacity-80"
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
                                    </svg>
                                    <span className="text-2xl font-bold text-center">
                                        {t('canaryWeather')}
                                    </span>
                                    <span className="text-blue-100 mt-2">
                                        {t('heroImage')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

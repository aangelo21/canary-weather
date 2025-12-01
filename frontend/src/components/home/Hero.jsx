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
            {/* 
             * Main Container
             * Centers content and handles padding for different screen sizes.
             * Adjusted top padding (pt-8, lg:pt-10) to balance the removal of global layout margin.
             */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-10 lg:pt-10 xl:pt-12 lg:pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                    {/* Left Column: Text Content and CTAs */}
                    <div className="flex flex-col justify-center text-center lg:text-left lg:-mt-8 xl:-mt-16">
                        <div className="space-y-6">
                            {/* Badge: Small highlight text */}
                            <div className="inline-flex items-center justify-center lg:justify-start">
                                <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold tracking-wide uppercase">
                                    {t('weatherApp') || 'Canary Islands Forecast'}
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
                         * Replaces the static phone image for a more dynamic and reliable visual.
                         */}
                        <div className="relative w-full max-w-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 transform lg:rotate-y-12 hover:rotate-0 transition-all duration-700 ease-out group">
                            
                            {/* Card Header: Location & Time */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Tenerife
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">Canary Islands</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wide">
                                    Live
                                </span>
                            </div>

                            {/* Card Body: Main Weather Icon & Temp */}
                            <div className="flex flex-col items-center justify-center py-4">
                                {/* Animated Sun Icon */}
                                <div className="relative w-32 h-32 mb-4">
                                    <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    <svg className="w-full h-full text-orange-500 animate-[spin_10s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="text-6xl font-bold text-gray-900 dark:text-white tracking-tighter">
                                    24<span className="text-4xl align-top text-brand-primary">°C</span>
                                </div>
                                <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mt-2">
                                    Sunny & Clear
                                </p>
                            </div>

                            {/* Card Footer: Mini Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Wind</p>
                                    <p className="font-bold text-gray-900 dark:text-white">12 km/h</p>
                                </div>
                                <div className="text-center border-l border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Humidity</p>
                                    <p className="font-bold text-gray-900 dark:text-white">45%</p>
                                </div>
                                <div className="text-center border-l border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">UV</p>
                                    <p className="font-bold text-gray-900 dark:text-white">High</p>
                                </div>
                            </div>

                            {/* Floating Elements (Decorations) */}
                            <div className="absolute -right-12 top-1/4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <div className="absolute -left-8 bottom-1/4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl animate-bounce hidden lg:block" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <span className="text-2xl" role="img" aria-label="wave">🌊</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

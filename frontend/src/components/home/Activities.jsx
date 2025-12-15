import { useTranslation } from 'react-i18next';


export default function Activities() {
    const { t } = useTranslation();

    return (
        <div className="pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('forecastForYou') || 'Forecast for you'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('lifestyleDesc') ||
                            "Whether you're catching waves or climbing peaks, get the precise data you need."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {}
                    <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-xl">
                        {}
                        <img
                            src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80"
                            alt={t('surfing') || 'Surfing & Water Sports'}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />

                        {}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                        {}
                        <div className="absolute bottom-0 left-0 p-8 z-10">
                            <div className="text-white mb-2">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {t('surfing') || 'Surfing & Water Sports'}
                            </h3>
                            <p className="text-gray-200 text-sm">
                                {t('surfingDesc') ||
                                    'Swell height, wind direction, and tide charts.'}
                            </p>
                        </div>
                    </div>

                    {}
                    <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"
                            alt={t('hiking') || 'Hiking & Trekking'}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 z-10">
                            <div className="text-white mb-2">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {t('hiking') || 'Hiking & Trekking'}
                            </h3>
                            <p className="text-gray-200 text-sm">
                                {t('hikingDesc') ||
                                    'Temperature at altitude and visibility forecasts.'}
                            </p>
                        </div>
                    </div>

                    {}
                    <div className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
                            alt={t('stargazing') || 'Stargazing'}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 z-10">
                            <div className="text-white mb-2">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {t('stargazing') || 'Stargazing'}
                            </h3>
                            <p className="text-gray-200 text-sm">
                                {t('stargazingDesc') ||
                                    'Cloud coverage and moon phase for clear skies.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

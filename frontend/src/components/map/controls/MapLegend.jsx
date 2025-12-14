import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';

const MapLegend = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Disable click propagation to prevent map clicks
    useEffect(() => {
        const legend = document.getElementById('map-legend-container');
        if (legend) {
            L.DomEvent.disableClickPropagation(legend);
        }
    }, [isOpen]);

    return (
        <div id="map-legend-container" className="relative z-[1000]">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full shadow-lg backdrop-blur-md border transition-all duration-300 flex items-center justify-center group ${
                    isOpen 
                        ? 'bg-blue-600 border-blue-500 text-white rotate-180' 
                        : 'bg-white/90 dark:bg-gray-900/90 border-white/20 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800'
                }`}
                title={t('mapLegend') || "Map Guide"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>

            {/* Legend Panel */}
            <div 
                className={`absolute top-16 left-0 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-300 origin-top-left ${
                    isOpen 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="p-5">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
                        {t('howToUseMap') || "Map Guide"}
                    </h3>

                    <div className="space-y-4">
                        {/* Interaction */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Click Anywhere</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Click on any location to see detailed weather, forecast, and save it as a POI.
                                </p>
                            </div>
                        </div>

                        {/* Layers */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Map Layers</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Use the bottom-left controls to switch between Clouds, Rain, Temperature, and Wind layers.
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Search & Locate</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Find specific cities or use the GPS button to jump to your current location.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Tip */}
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] text-center text-gray-400 italic">
                            Tip: You can save your favorite locations by logging in.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapLegend;
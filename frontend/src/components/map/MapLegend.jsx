import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * MapLegend Component.
 *
 * Displays a guide/legend for the Interactive Map.
 * Explains the available layers, controls, and markers to help users navigate the map features.
 *
 * Features:
 * - **Layer Explanations**: Describes what each weather layer represents.
 * - **Control Guide**: Explains how to use the search and location buttons.
 * - **Visual Cues**: Uses icons and text to make the guide visually appealing.
 *
 * @component
 * @returns {JSX.Element} The rendered MapLegend component.
 */
function MapLegend() {
    const { t } = useTranslation();

    const layers = [
        {
            name: 'Clouds',
            description: 'Shows cloud cover percentage. White areas indicate heavy cloud cover.',
            icon: (
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            ),
        },
        {
            name: 'Precipitation',
            description: 'Displays rain intensity. Blue/Purple areas indicate rainfall.',
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            ),
        },
        {
            name: 'Temperature',
            description: 'Heatmap of current temperatures. Red is hot, blue is cold.',
            icon: (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            name: 'Wind Speed',
            description: 'Visualizes wind speed and direction.',
            icon: (
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                Map Guide
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Layers Section */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Weather Layers
                    </h4>
                    <div className="space-y-4">
                        {layers.map((layer) => (
                            <div key={layer.name} className="flex items-start gap-3">
                                <div className="mt-1 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    {layer.icon}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{layer.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{layer.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls Section */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Controls & Features
                    </h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Search Location</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Find specific towns or places in the Canary Islands.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Points of Interest</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Discover key locations and tourist spots marked on the map.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Interactive Weather</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Click anywhere on the map to get real-time weather data for that exact spot.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MapLegend;

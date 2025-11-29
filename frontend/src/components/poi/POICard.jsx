import { useTranslation } from 'react-i18next';

/**
 * Returns the appropriate weather emoji based on the condition.
 *
 * @param {string} condition - The weather condition string.
 * @returns {string} The emoji representing the weather.
 */
function getWeatherEmoji(condition) {
    const c = (condition || '').toLowerCase();
    if (c.includes('clear')) return '☀️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('rain')) return '🌧️';
    if (c.includes('drizzle')) return '🌦️';
    if (c.includes('thunder') || c.includes('storm')) return '⛈️';
    if (c.includes('snow')) return '❄️';
    if (
        c.includes('mist') ||
        c.includes('fog') ||
        c.includes('haze') ||
        c.includes('smoke')
    )
        return '🌫️';
    return '🌤️';
}

/**
 * POICard component.
 * Displays a single Point of Interest (POI) in a card format,
 * showing its image, name, description, weather data, location info, and action buttons.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.poi - The POI data object.
 * @param {Object} props.weather - The weather data object for the POI.
 * @param {Function} [props.onEdit] - Callback function for the edit action.
 * @param {Function} [props.onDelete] - Callback function for the delete action.
 * @returns {JSX.Element} The rendered POICard component.
 */
export default function POICard({ poi, weather, onEdit, onDelete }) {
    const { t } = useTranslation();
    const API_BASE = import.meta.env.VITE_API_BASE;
    const baseUrl = API_BASE?.replace('/api', '') || '';
    const imageUrl = poi.image_url ? `${baseUrl}${poi.image_url}` : null;

    return (
        <article className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={poi.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.classList.remove('hidden');
                            e.target.nextSibling.classList.add('flex');
                        }}
                    />
                ) : null}

                <div
                    className={`${imageUrl ? 'hidden' : 'flex'} w-full h-full bg-linear-to-br from-blue-500 to-cyan-400 items-center justify-center`}
                >
                    <svg
                        className="w-12 h-12 text-white/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <div className="absolute top-3 right-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                            poi.type === 'global'
                                ? 'bg-yellow-400/90 text-yellow-900'
                                : poi.type === 'personal'
                                  ? 'bg-purple-500/90 text-white'
                                  : 'bg-blue-500/90 text-white'
                        }`}
                    >
                        {(poi.type === 'global'
                            ? t('global')
                            : poi.type === 'personal'
                              ? t('personal')
                              : t('local')
                        ).toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col grow">
                <div className="mb-3">
                    <h3
                        className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1"
                        title={poi.name}
                    >
                        {poi.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
                        {poi.description}
                    </p>
                </div>

                {weather ? (
                    <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('temperature') || 'Temp'}
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {weather.temp !== null &&
                                    weather.temp !== undefined
                                        ? `${Math.round(weather.temp)}°C`
                                        : '--'}
                                </div>
                            </div>

                            <div className="text-center">
                                <span className="sr-only">
                                    {weather.description || t('condition')}
                                </span>
                                <div
                                    className="text-4xl sm:text-5xl"
                                    title={weather.description}
                                    aria-hidden
                                >
                                    {getWeatherEmoji(
                                        weather.condition ||
                                            weather.description ||
                                            ''
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('wind')}
                                </div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                    {weather.wind
                                        ? `${Math.round(weather.wind)} m/s`
                                        : '--'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('humidity')}
                                </div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                    {weather.humidity
                                        ? `${weather.humidity}%`
                                        : '--'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('clouds')}
                                </div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                    {weather.clouds !== null &&
                                    weather.clouds !== undefined
                                        ? `${weather.clouds}%`
                                        : '--'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('loading')}
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4 mt-auto">
                    <svg
                        className="w-4 h-4"
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
                    <span>
                        {poi.latitude?.toFixed(4)}, {poi.longitude?.toFixed(4)}
                    </span>
                </div>

                {(onEdit || onDelete) && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                {t('edit')}
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                {t('delete')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

import InteractiveMap from '../components/map/InteractiveMap';
import { useTranslation } from 'react-i18next';

/**
 * Map page component.
 * Displays the interactive map for exploring weather.
 *
 * @returns {JSX.Element} The rendered Map page.
 */
function Map() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
                {t('exploreMap')}
            </h2>
            <h3 className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('mapDescription')}
            </h3>
            <InteractiveMap />
        </div>
    );
}

export default Map;

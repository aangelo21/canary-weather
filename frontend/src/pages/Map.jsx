import InteractiveMap from '../components/map/InteractiveMap';
import MapLegend from '../components/map/MapLegend';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

/**
 * Map Page Component.
 *
 * Renders the dedicated Map page, which features the `InteractiveMap` component.
 * This page allows users to explore weather conditions across the Canary Islands visually.
 *
 * Features:
 * - **Header**: Displays a localized title and description.
 * - **Interactive Map**: Embeds the main map component for user interaction.
 * - **Map Guide**: Provides a legend and guide for using the map features.
 * - **Responsive Layout**: Adjusts padding and spacing for different screen sizes.
 *
 * @component
 * @returns {JSX.Element} The rendered Map page.
 */
function Map() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8 py-8">
            <SEO 
                title="Interactive Map" 
                description="Explore weather conditions, wind patterns, and wave heights across the Canary Islands with our interactive map."
            />
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
                {t('exploreMap')}
            </h2>
            <h3 className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('mapDescription')}
            </h3>
            <InteractiveMap />
            <MapLegend />
        </div>
    );
}

export default Map;

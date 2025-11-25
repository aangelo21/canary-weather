// Import the InteractiveMap component for displaying the map
import InteractiveMap from "../components/InteractiveMap";
import { useTranslation } from "react-i18next";

// Map page component - displays the interactive map for exploring weather
function Map() {
    const { t } = useTranslation();
    return (
        // Container with vertical spacing between elements
        <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8 py-8">
            {/* Main heading for the map page */}
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">{t('exploreMap')}</h2>
            {/* Subtitle explaining how to interact with the map */}
            <h3 className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('mapDescription')}
            </h3>
            {/* Render the InteractiveMap component */}
            <InteractiveMap />
        </div>
    );
}

// Export the Map component as default
export default Map;

// Import the InteractiveMap component for displaying the map
import InteractiveMap from "../components/InteractiveMap";
import { useTranslation } from "react-i18next";

// Map page component - displays the interactive map for exploring weather
function Map() {
    const { t } = useTranslation();
    return (
        // Container with vertical spacing between elements
        <div className="flex flex-col gap-10">
            {/* Main heading for the map page */}
            <h2 className="text-4xl font-bold text-center">{t('exploreMap')}</h2>
            {/* Subtitle explaining how to interact with the map */}
            <h3 className="text-2xl font-semibold text-center">
                {t('clickLocation')}
            </h3>
            {/* Render the InteractiveMap component */}
            <InteractiveMap />
        </div>
    );
}

// Export the Map component as default
export default Map;

import InteractiveMap from '../components/map/InteractiveMap';
import MapLegend from '../components/map/MapLegend';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';


function Map() {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full relative">
            <SEO
                title="Interactive Map"
                description="Explore weather conditions, wind patterns, and wave heights across the Canary Islands with our interactive map."
            />
            <InteractiveMap />
        </div>
    );
}

export default Map;

// Import the InteractiveMap component for displaying the map
import InteractiveMap from "../components/InteractiveMap";

// Map page component - displays the interactive map for exploring weather
function Map() {
    return (
        // Container with vertical spacing between elements
        <div className="flex flex-col gap-10">
            {/* Main heading for the map page */}
            <h2 className="text-4xl font-bold text-center">Explora el Mapa</h2>
            {/* Subtitle explaining how to interact with the map */}
            <h3 className="text-2xl font-semibold text-center">
                Haz clic en una Ubicación para ver su pronóstico
            </h3>
            {/* Render the InteractiveMap component */}
            <InteractiveMap />
        </div>
    );
}

// Export the Map component as default
export default Map;
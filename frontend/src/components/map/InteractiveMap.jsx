import { MapContainer, Marker } from 'react-leaflet';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { fetchPois } from '../../services/poiService';
import MapControls from './controls/MapControls';
import MapLayers from './layers/MapLayers';
import MapMarkers from './layers/MapMarkers';
import MapEvents from './components/MapEvents';

/**
 * InteractiveMap Component.
 *
 * Renders a highly interactive Leaflet map centered on the Canary Islands.
 *
 * Features:
 * - **Multi-Layer Support**: Switch between different base maps and weather overlays.
 * - **Points of Interest**: Displays markers for key locations.
 * - **Interactive Clicking**: Captures click events to fetch real-time weather data.
 * - **Search Functionality**: Allows users to search for specific locations.
 * - **Sidebar**: Displays custom weather data or POI details in a sliding sidebar.
 * - **Modern UI**: Glassmorphism controls and responsive design.
 *
 * @component
 * @returns {JSX.Element} The rendered InteractiveMap component.
 */
function InteractiveMap() {
    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    /**
     * @type {[Array<number>|null, Function]} clickedPos - State for the [latitude, longitude] of the last click.
     */
    const [clickedPos, setClickedPos] = useState(null);

    /**
     * @type {[Object|null, Function]} weather - State for the fetched weather data.
     */
    const [weather, setWeather] = useState(null);

    /**
     * @type {[boolean, Function]} loading - State to indicate if weather data is being fetched.
     */
    const [loading, setLoading] = useState(false);

    /**
     * @type {[Array<Object>, Function]} pois - State for the fetched Points of Interest.
     */
    const [pois, setPois] = useState([]);

    /**
     * @type {[boolean, Function]} isSidebarOpen - State to control sidebar visibility.
     */
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const markerRef = useRef(null);

    // Fetch POIs on mount
    useEffect(() => {
        const loadPois = async () => {
            try {
                const data = await fetchPois();
                setPois(data);
            } catch (error) {
                console.error('Failed to fetch POIs:', error);
            }
        };
        loadPois();
    }, []);

    const fetchWeather = async (lat, lng) => {
        setLoading(true);
        setWeather(null);
        setIsSidebarOpen(true); // Open sidebar when fetching starts
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
            );
            const data = await res.json();
            setWeather({
                temp: data.main?.temp ?? null,
                humidity: data.main?.humidity ?? null,
                pressure: data.main?.pressure ?? null,
                wind: data.wind?.speed ?? null,
                description: data.weather?.[0]?.description ?? '',
                main: data.weather?.[0]?.main ?? '',
                dt: data.dt,
                sunrise: data.sys?.sunrise,
                sunset: data.sys?.sunset,
                clouds: data.clouds?.all ?? 0,
            });
        } catch {
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the closing of the sidebar.
     */
    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
        setClickedPos(null);
        setWeather(null);
    };

    const bounds = [
        [26.5, -19.5],
        [30.5, -12.5],
    ];

    return (
        <div className="relative w-full h-full overflow-hidden">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={handleSidebarClose} 
                weather={weather} 
                loading={loading} 
                position={clickedPos}
            />
            
            <MapContainer
                center={[28.5, -16]}
                zoom={8}
                minZoom={8}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                zoomControl={false}
            >
                {/* Map Layers (Base & Weather) */}
                <MapLayers apiKey={OPENWEATHER_API_KEY} />

                {/* Points of Interest Markers */}
                <MapMarkers pois={pois} />

                {/* Event Handlers */}
                <MapEvents setClickedPos={setClickedPos} fetchWeather={fetchWeather} />

                {/* Custom Controls */}
                <MapControls setClickedPos={setClickedPos} fetchWeather={fetchWeather} />

                {/* Marker for clicked position */}
                {clickedPos && (
                    <Marker position={clickedPos} ref={markerRef} />
                )}
            </MapContainer>
        </div>
    );
}

export default InteractiveMap;

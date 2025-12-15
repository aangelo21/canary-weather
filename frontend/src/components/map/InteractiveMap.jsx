import { MapContainer, Marker, ZoomControl } from 'react-leaflet';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { fetchPois } from '../../services/poiService';
import MapControls from './controls/MapControls';
import MapLayers from './layers/MapLayers';
import MapMarkers from './layers/MapMarkers';
import MapEvents from './components/MapEvents';


function InteractiveMap() {
    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    
    const [clickedPos, setClickedPos] = useState(null);

    
    const [weather, setWeather] = useState(null);

    
    const [loading, setLoading] = useState(false);

    
    const [pois, setPois] = useState([]);

    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const markerRef = useRef(null);

    
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
        setIsSidebarOpen(true); 
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`,
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
                <ZoomControl position="bottomleft" />
                {}
                <MapLayers apiKey={OPENWEATHER_API_KEY} />

                {}
                <MapMarkers pois={pois} />

                {}
                <MapEvents
                    setClickedPos={setClickedPos}
                    fetchWeather={fetchWeather}
                />

                {}
                <MapControls
                    setClickedPos={setClickedPos}
                    fetchWeather={fetchWeather}
                />

                {}
                {clickedPos && <Marker position={clickedPos} ref={markerRef} />}
            </MapContainer>
        </div>
    );
}

export default InteractiveMap;

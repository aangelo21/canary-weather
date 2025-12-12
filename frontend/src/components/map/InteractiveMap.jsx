import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
    LayersControl,
    LayerGroup,
} from 'react-leaflet';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WeatherPopup from './WeatherPopup';
import { useTheme } from '../../context/ThemeContext';
import L from 'leaflet';
import { fetchPois } from '../../services/poiService';

/**
 * MapClickHandler Component (Internal).
 *
 * Hooks into Leaflet's map events to handle clicks.
 */
function MapClickHandler({ setClickedPos, fetchWeather }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setClickedPos([lat, lng]);
            fetchWeather(lat, lng);
        },
    });
    return null;
}

/**
 * MapUpdater Component (Internal).
 *
 * Updates the map view based on location state.
 */
function MapUpdater({ setClickedPos, fetchWeather }) {
    const map = useMap();
    const location = useLocation();
    const lastCoords = useRef(null);

    useEffect(() => {
        if (location.state?.lat && location.state?.lng) {
            const { lat, lng } = location.state;
            const coordsStr = `${lat},${lng}`;
            
            if (lastCoords.current !== coordsStr) {
                map.flyTo([lat, lng], 13);
                setClickedPos([lat, lng]);
                fetchWeather(lat, lng);
                lastCoords.current = coordsStr;
            }
        }
    }, [location.state, map, setClickedPos, fetchWeather]);

    return null;
}

/**
 * MapControls Component (Internal).
 *
 * Renders custom map controls for reset, locate, and search.
 */
function MapControls({ setClickedPos, fetchWeather }) {
    const map = useMap();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const controls = document.getElementById('map-controls');
        if (controls) {
            L.DomEvent.disableClickPropagation(controls);
        }
    }, []);

    const handleReset = () => {
        map.flyTo([28.5, -16], 8);
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.flyTo([latitude, longitude], 13);
                setClickedPos([latitude, longitude]);
                fetchWeather(latitude, longitude);
            },
            () => {
                alert('Unable to retrieve your location');
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
        );
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Use Nominatim for search, bounded to Canary Islands
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}&viewbox=-19.5,26.5,-12.5,30.5&bounded=1`
            );
            const results = await response.json();

            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                map.flyTo([latitude, longitude], 13);
                setClickedPos([latitude, longitude]);
                fetchWeather(latitude, longitude);
            } else {
                alert('Location not found in Canary Islands');
            }
        } catch (error) {
            console.error('Search failed:', error);
            alert('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div
            id="map-controls"
            className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 items-end"
        >
            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 mb-2"
            >
                <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-2 py-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white w-32 sm:w-60"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                    {isSearching ? (
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    )}
                </button>
            </form>

            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                    }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Reset View"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                    >
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLocate();
                    }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="My Location"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

/**
 * InteractiveMap Component.
 *
 * Renders a highly interactive Leaflet map centered on the Canary Islands.
 *
 * Features:
 * - **Multi-Layer Support**: Switch between different base maps (Terrain, OSM) and weather overlays (Clouds, Rain, Temp, etc.).
 * - **Points of Interest**: Displays markers for key locations fetched from the backend.
 * - **Interactive Clicking**: Captures click events to fetch real-time weather data for any coordinate.
 * - **Search Functionality**: Allows users to search for specific locations within the Canary Islands.
 * - **Dynamic Popup**: Displays custom weather data or POI details.
 * - **Theme Support**: Adapts the map tiles based on light/dark mode.
 * - **Bounds Restriction**: Restricts panning to the Canary Islands region.
 *
 * @component
 * @returns {JSX.Element} The rendered InteractiveMap component.
 */
function InteractiveMap() {
    const { isDarkMode } = useTheme();
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
     * @type {[Array<Object>, Function]} pois - State for the fetched Points of Interest.
     */
    const [pois, setPois] = useState([]);

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
        setWeather(null);
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
        }
    };

    /**
     * Handles the closing of the weather popup.
     * Resets the clicked position and weather data states.
     */
    const handlePopupClose = () => {
        setClickedPos(null);
        setWeather(null);
    };

    /**
     * Effect hook to automatically open the popup when weather data is ready.
     */
    useEffect(() => {
        if (markerRef.current && clickedPos && weather != null) {
            markerRef.current.openPopup();
        }
    }, [clickedPos, weather]);

    const bounds = [
        [26.5, -19.5],
        [30.5, -12.5],
    ];

    return (
        <div className="flex justify-center mb-20">
            <MapContainer
                center={[28.5, -16]}
                zoom={8}
                minZoom={8}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                className="leaflet-container shadow-xl dark:shadow-black/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl h-[50vh] md:h-[600px] w-full"
            >
                <LayersControl position="topleft">
                    {/* Base Layers */}
                    <LayersControl.BaseLayer checked name="Terrain (Google)">
                        <TileLayer
                            key={isDarkMode ? 'dark-terrain' : 'light-terrain'}
                            className={isDarkMode ? 'dark-map-tiles' : ''}
                            attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google</a>'
                            url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap">
                        <TileLayer
                            key={isDarkMode ? 'dark-osm' : 'light-osm'}
                            className={isDarkMode ? 'dark-map-tiles' : ''}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite (Esri)">
                        <TileLayer
                            key={isDarkMode ? 'dark-sat' : 'light-sat'}
                            className={isDarkMode ? 'dark-map-tiles' : ''}
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>

                    {/* Weather Overlays */}
                    <LayersControl.Overlay name="Clouds">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Precipitation">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Temperature">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Wind Speed">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Pressure">
                        <TileLayer
                            url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
                            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                    </LayersControl.Overlay>

                    {/* Points of Interest Overlay */}
                    <LayersControl.Overlay name="Points of Interest">
                        <LayerGroup>
                            {pois.map((poi) => (
                                <Marker
                                    key={poi.id}
                                    position={[poi.latitude, poi.longitude]}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-bold text-lg">
                                                {poi.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {poi.description}
                                            </p>
                                            {poi.image_url && (
                                                <img
                                                    src={poi.image_url}
                                                    alt={poi.name}
                                                    className="mt-2 rounded-md w-full h-32 object-cover"
                                                />
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

                <MapClickHandler setClickedPos={setClickedPos} fetchWeather={fetchWeather} />
                <MapUpdater setClickedPos={setClickedPos} fetchWeather={fetchWeather} />
                <MapControls setClickedPos={setClickedPos} fetchWeather={fetchWeather} />
                {clickedPos && (
                    <Marker position={clickedPos} ref={markerRef}>
                        {weather != null && (
                            <WeatherPopup
                                position={clickedPos}
                                weather={weather}
                                markerRef={markerRef}
                                onClose={handlePopupClose}
                            />
                        )}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default InteractiveMap;

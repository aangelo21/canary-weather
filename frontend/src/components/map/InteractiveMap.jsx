import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useRef, useEffect } from 'react';
import WeatherPopup from './WeatherPopup';
import { useTheme } from '../../context/ThemeContext';
import L from 'leaflet';

/**
 * InteractiveMap Component.
 *
 * Renders a Leaflet map centered on the Canary Islands.
 * Allows users to click anywhere on the map to retrieve real-time weather data for that specific coordinate.
 *
 * Features:
 * - **Interactive Clicking**: Captures click events to fetch weather data from OpenWeatherMap API.
 * - **Dynamic Popup**: Displays a custom `WeatherPopup` with the fetched data at the clicked location.
 * - **Theme Support**: Adapts the map tiles (via CSS filters) based on the application's light/dark mode.
 * - **Bounds Restriction**: Restricts panning to the Canary Islands region.
 *
 * @component
 * @returns {JSX.Element} The rendered InteractiveMap component.
 */
function InteractiveMap() {
    const { isDarkMode } = useTheme();
    
    /**
     * @type {[Array<number>|null, Function]} clickedPos - State for the [latitude, longitude] of the last click.
     */
    const [clickedPos, setClickedPos] = useState(null);

    /**
     * @type {[Object|null, Function]} weather - State for the fetched weather data.
     */
    const [weather, setWeather] = useState(null);

    const markerRef = useRef(null);

    const fetchWeather = async (lat, lng) => {
        setWeather(null);
        try {
            const OPENWEATHER_API_KEY =
                import.meta.env.VITE_OPENWEATHER_API_KEY;
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
     * MapClickHandler Component (Internal).
     *
     * A headless component that hooks into Leaflet's map events.
     * It listens for 'click' events, updates the `clickedPos` state, and triggers the weather data fetch.
     *
     * @returns {null} This component does not render any visible elements.
     */
    function MapClickHandler() {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setClickedPos([lat, lng]);
                fetchWeather(lat, lng);
            },
        });
        return null;
    }

    function MapControls() {
        const map = useMap();

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

        return (
            <div
                id="map-controls"
                className="absolute top-4 right-4 z-[1000] flex flex-col gap-2"
            >
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
        );
    }

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
                className="leaflet-container shadow-xl dark:shadow-black/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl"
            >
                <TileLayer
                    key={isDarkMode ? 'dark' : 'light'}
                    className={isDarkMode ? 'dark-map-tiles' : ''}
                    attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google</a>'
                    url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                />

                <MapClickHandler />
                <MapControls />
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

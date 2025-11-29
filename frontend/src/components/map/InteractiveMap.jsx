import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useRef, useEffect } from 'react';
import WeatherPopup from './WeatherPopup';
import { useTheme } from '../../context/ThemeContext';

/**
 * InteractiveMap component.
 * Renders an interactive map of the Canary Islands where users can click
 * to get weather information for any location. It integrates with OpenWeatherMap API
 * to fetch real-time weather data and displays it in a popup on the map.
 *
 * @returns {JSX.Element} The rendered InteractiveMap component.
 */
function InteractiveMap() {
    const { isDarkMode } = useTheme();
    const [clickedPos, setClickedPos] = useState(null);
    const [weather, setWeather] = useState(null);
    const markerRef = useRef(null);

    /**
     * MapClickHandler component.
     * Handles map click events.
     * This is a custom component that uses Leaflet's useMapEvents hook
     * to listen for click events and fetch weather data asynchronously.
     *
     * @returns {null} This component does not render anything.
     */
    function MapClickHandler() {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setClickedPos([lat, lng]);
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
            },
        });
        return null;
    }

    /**
     * Handles the popup close event.
     */
    const handlePopupClose = () => {
        setClickedPos(null);
        setWeather(null);
    };

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

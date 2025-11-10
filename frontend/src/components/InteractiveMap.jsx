import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import WeatherPopup from "./WeatherPopup";

function InteractiveMap() {
    const [clickedPos, setClickedPos] = useState(null);
    const [weather, setWeather] = useState(null);
    const markerRef = useRef(null);

    function MapClickHandler() {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setClickedPos([lat, lng]);
                setWeather(null);
                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=6face86f22b577e34d37321df89e1511&units=metric`
                    );
                    const data = await res.json();
                    setWeather({
                        temp: data.main?.temp ?? null,
                        humidity: data.main?.humidity ?? null,
                        pressure: data.main?.pressure ?? null,
                        wind: data.wind?.speed ?? null,
                        description: data.weather?.[0]?.description ?? "",
                    });
                } catch {
                    setWeather(null);
                }
            },
        });
        return null;
    }

    useEffect(() => {
        if (markerRef.current && clickedPos && weather != null) {
            markerRef.current.openPopup();
        }
    }, [clickedPos, weather]);

    const bounds = [
        [27.5, -18],
        [29.5, -14],
    ];
    return (
        <div className="flex justify-center">
            <MapContainer
                center={[28.5, -16]}
                zoom={8}
                minZoom={8}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
                className="leaflet-container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler />
                {clickedPos && (
                    <Marker position={clickedPos} ref={markerRef}>
                        {weather != null && (
                            <WeatherPopup
                                position={clickedPos}
                                weather={weather}
                                markerRef={markerRef}
                            />
                        )}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default InteractiveMap;

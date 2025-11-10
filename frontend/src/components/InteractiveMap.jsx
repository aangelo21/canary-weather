import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import WeatherPopup from "./WeatherPopup";

function InteractiveMap() {
    const [clickedPos, setClickedPos] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const markerRef = useRef(null);

    function MapClickHandler() {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setClickedPos([lat, lng]);
                setTemperature(null);
                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=6face86f22b577e34d37321df89e1511&units=metric`
                    );
                    const data = await res.json();
                    setTemperature(data.main?.temp ?? null);
                } catch {
                    setTemperature(null);
                }
            },
        });
        return null;
    }

    useEffect(() => {
        if (markerRef.current && clickedPos && temperature != null) {
            markerRef.current.openPopup();
        }
    }, [clickedPos, temperature]);

    return (
        <div className="flex justify-center">
            <MapContainer
                center={[28.5, -16]}
                zoom={8}
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
                        {temperature != null && (
                            <WeatherPopup
                                position={clickedPos}
                                temperature={temperature}
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

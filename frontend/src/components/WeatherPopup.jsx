import React, { useEffect, useRef, useState } from "react";
import { Popup } from "react-leaflet";
import { createOrUpdatePoi } from "../services/poiService";

function WeatherPopup({ position, weather, markerRef }) {
    const popupRef = useRef(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (popupRef.current && markerRef?.current) {
            markerRef.current.openPopup();
        }
    }, [position, weather, markerRef]);
    if (!position || !weather) return null;

    const handleSavePoi = async () => {
        setSaving(true);
        try {
            await createOrUpdatePoi({
                name: `POI ${position[0].toFixed(4)},${position[1].toFixed(4)}`,
                latitude: position[0],
                longitude: position[1],
                description: "",
                is_global: false,
            });
            setSaved(true);
        } catch {
            // optional error handling
        }
        setSaving(false);
    };

    return (
        <Popup position={position} ref={popupRef}>
            <div className="p-2 text-center">
                <span className="text-lg font-semibold">{weather.temp}°C</span>
                <div className="text-sm mt-1">
                    <div>Condition: {weather.description}</div>
                    <div>Humidity: {weather.humidity}%</div>
                    <div>Pressure: {weather.pressure} hPa</div>
                    <div>Wind: {weather.wind} m/s</div>
                </div>
                <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSavePoi}
                    disabled={saved || saving}
                >
                    {saving ? "Saving..." : saved ? "Saved" : "Save as POI"}
                </button>
                {saved && (
                    <div className="mt-2 text-green-600 text-sm">
                        POI saved!
                    </div>
                )}
            </div>
        </Popup>
    );
}

export default WeatherPopup;

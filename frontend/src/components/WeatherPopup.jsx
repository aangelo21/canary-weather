import React, { useEffect, useRef } from "react";
import { Popup } from "react-leaflet";

function WeatherPopup({ position, temperature, markerRef }) {
    const popupRef = useRef(null);
    useEffect(() => {
        if (popupRef.current && markerRef?.current) {
            markerRef.current.openPopup();
        }
    }, [position, temperature, markerRef]);
    if (!position || temperature == null) return null;
    return (
        <Popup position={position} ref={popupRef}>
            <div className="p-2 text-center">
                <span className="text-lg font-semibold">{temperature}°C</span>
            </div>
        </Popup>
    );
}

export default WeatherPopup;

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to update the map view based on the router location state.
 *
 * @param {Function} setClickedPos - Function to update the clicked position state.
 * @param {Function} fetchWeather - Function to fetch weather data.
 */
const useMapUpdater = (setClickedPos, fetchWeather) => {
    const map = useMap();
    const location = useLocation();
    const lastCoords = useRef(null);

    useEffect(() => {
        if (location.state?.lat && location.state?.lng) {
            const { lat, lng } = location.state;
            const coordsStr = `${lat},${lng}`;
            
            if (lastCoords.current !== coordsStr) {
                map.flyTo([lat, lng], 13, {
                    duration: 2
                });
                setClickedPos([lat, lng]);
                fetchWeather(lat, lng);
                lastCoords.current = coordsStr;
            }
        }
    }, [location.state, map, setClickedPos, fetchWeather]);
};

export default useMapUpdater;

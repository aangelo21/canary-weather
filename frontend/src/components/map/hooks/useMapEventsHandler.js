import { useMapEvents } from 'react-leaflet';

/**
 * Custom hook to handle map click events.
 *
 * @param {Function} setClickedPos - Function to update the clicked position state.
 * @param {Function} fetchWeather - Function to fetch weather data for the clicked location.
 */
const useMapEventsHandler = (setClickedPos, fetchWeather) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setClickedPos([lat, lng]);
            fetchWeather(lat, lng);
        },
    });
};

export default useMapEventsHandler;

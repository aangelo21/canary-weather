import { useMapEvents } from 'react-leaflet';


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

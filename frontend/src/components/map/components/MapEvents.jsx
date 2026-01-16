import React from 'react';
import useMapEventsHandler from '../hooks/useMapEventsHandler';
import useMapUpdater from '../hooks/useMapUpdater';


const MapEvents = ({ setClickedPos, fetchWeather }) => {
    useMapEventsHandler(setClickedPos, fetchWeather);
    useMapUpdater(setClickedPos, fetchWeather);
    return null;
};

export default MapEvents;

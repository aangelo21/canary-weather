import React from 'react';
import useMapEventsHandler from '../hooks/useMapEventsHandler';
import useMapUpdater from '../hooks/useMapUpdater';

/**
 * MapEvents Component.
 *
 * A wrapper component to initialize map event listeners and updaters.
 * This component must be a child of MapContainer to access the map context.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setClickedPos - Function to update the clicked position state.
 * @param {Function} props.fetchWeather - Function to fetch weather data.
 */
const MapEvents = ({ setClickedPos, fetchWeather }) => {
    useMapEventsHandler(setClickedPos, fetchWeather);
    useMapUpdater(setClickedPos, fetchWeather);
    return null;
};

export default MapEvents;

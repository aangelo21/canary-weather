import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';
import { useTheme } from '../../../context/ThemeContext';

/**
 * MapLayers Component.
 *
 * Manages the base maps and weather overlay layers for the map.
 *
 * @param {Object} props - Component props.
 * @param {string} props.apiKey - OpenWeatherMap API Key.
 */
const MapLayers = ({ apiKey }) => {
    const { isDarkMode } = useTheme();

    return (
        <LayersControl position="bottomleft">
            {/* Base Layers */}
            <LayersControl.BaseLayer checked name="Terrain (Google)">
                <TileLayer
                    key={isDarkMode ? 'dark-terrain' : 'light-terrain'}
                    className={isDarkMode ? 'dark-map-tiles filter grayscale-[20%] contrast-[1.1]' : ''}
                    attribution='&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google</a>'
                    url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                    maxZoom={20}
                />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap">
                <TileLayer
                    key={isDarkMode ? 'dark-osm' : 'light-osm'}
                    className={isDarkMode ? 'dark-map-tiles filter invert-[0.9] hue-rotate-180' : ''}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite (Esri)">
                <TileLayer
                    key={isDarkMode ? 'dark-sat' : 'light-sat'}
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
            </LayersControl.BaseLayer>

            {/* Weather Overlays */}
            <LayersControl.Overlay name="Clouds">
                <TileLayer
                    url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.8}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Precipitation">
                <TileLayer
                    url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.7}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Temperature">
                <TileLayer
                    url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.6}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Wind Speed">
                <TileLayer
                    url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.6}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Pressure">
                <TileLayer
                    url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                    attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    opacity={0.6}
                />
            </LayersControl.Overlay>
        </LayersControl>
    );
};

export default MapLayers;

import React, { useMemo } from 'react';
import { Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const MapMarkers = ({ pois }) => {
    const markers = useMemo(() => {
        return pois.map((poi) => (
            <Marker key={poi.id} position={[poi.latitude, poi.longitude]}>
                <Popup className="custom-popup">
                    <div className="p-3 min-w-[250px]">
                        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">
                            {poi.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                            {poi.description}
                        </p>
                        {poi.image_url && (
                            <div className="relative overflow-hidden rounded-lg shadow-md aspect-video">
                                <img
                                    src={poi.image_url}
                                    alt={poi.name}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                </Popup>
            </Marker>
        ));
    }, [pois]);

    return (
        <LayersControl.Overlay name="Points of Interest" checked>
            <LayerGroup>{markers}</LayerGroup>
        </LayersControl.Overlay>
    );
};

export default MapMarkers;

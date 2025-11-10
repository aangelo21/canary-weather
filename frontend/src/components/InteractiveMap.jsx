import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";

function InteractiveMap() {
    return (
            <div className="flex justify-center">
                <MapContainer center={[28.5, -16]} zoom={8} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
    );
}

export default InteractiveMap;

import InteractiveMap from "../components/InteractiveMap";

function Map() {
    return (
        <div className="flex flex-col gap-10">
            <h2 className="text-4xl font-bold text-center">Explora el Mapa</h2>
            <h3 className="text-2xl font-semibold text-center">
                Haz clic en una Ubicación para ver su pronóstico
            </h3>
            <InteractiveMap />
        </div>
    );
}

export default Map;
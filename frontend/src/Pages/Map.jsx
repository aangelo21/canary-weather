import InteractiveMap from "../components/InteractiveMap";

function Map() {
    return (
    <div className="flex flex-col gap-10">
            <h2 className="text-4xl font-bold text-center">Map Page</h2>
            <h3 className="text-2xl font-semibold text-center">Explore the Canary Islands</h3>
            <InteractiveMap />
        </div>
    );
}

export default Map;

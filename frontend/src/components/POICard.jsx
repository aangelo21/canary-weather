export default function POICard({ poi, weather, onEdit, onDelete }) {
    return (
        <article className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {poi.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {poi.description}
                    </p>
                    {weather && (
                        <div className="mt-2 text-blue-700 text-sm">
                            <span className="font-semibold">
                                {weather.temp}°C
                            </span>{" "}
                            <span>{weather.description}</span>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            poi.is_global
                                ? "bg-[#f2c200] text-black"
                                : "bg-[#0f6fb9] text-white"
                        }`}
                    >
                        {poi.is_global ? "GLOBAL" : "LOCAL"}
                    </span>
                </div>
            </div>

            <dl className="mt-4 text-sm text-gray-600">
                {poi.latitude && (
                    <div className="flex items-center justify-between py-1">
                        <dt className="font-medium">Latitude</dt>
                        <dd>{poi.latitude}</dd>
                    </div>
                )}
                {poi.longitude && (
                    <div className="flex items-center justify-between py-1">
                        <dt className="font-medium">Longitude</dt>
                        <dd>{poi.longitude}</dd>
                    </div>
                )}
                {poi.location_id && (
                    <div className="flex items-center justify-between py-1">
                        <dt className="font-medium">Location ID</dt>
                        <dd className="text-xs text-gray-400">
                            {poi.location_id}
                        </dd>
                    </div>
                )}
                <div className="flex items-center justify-between py-1">
                    <dt className="font-medium">Created</dt>
                    <dd className="text-sm text-gray-500">
                        {new Date(poi.createdAt).toLocaleDateString()}
                    </dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center justify-end gap-2">
                <button
                    onClick={onEdit}
                    className="px-3 py-1 rounded-md bg-[#ffd966] text-sm"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1 rounded-md bg-[#d64545] text-white text-sm"
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

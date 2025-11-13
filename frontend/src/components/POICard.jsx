export default function POICard({ poi, weather, onEdit, onDelete }) {
    const API_BASE = import.meta.env.VITE_API_BASE;
    const baseUrl = API_BASE?.replace('/api', '') || '';
    const imageUrl = poi.image_url ? `${baseUrl}${poi.image_url}` : null;
    
    return (
        <article className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="mb-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={poi.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300/0f6fb9/ffffff?text=No+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#0f6fb9] to-[#0a5a96] rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium opacity-80">No Image</p>
                        </div>
                    </div>
                )}
            </div>
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

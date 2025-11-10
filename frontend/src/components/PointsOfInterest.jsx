import { useState, useEffect } from "react";
import {
    fetchPois as fetchPoisService,
    createOrUpdatePoi,
    deletePoi as deletePoiService,
} from "../services/poiService";

export default function PointsOfInterest() {
    const [pois, setPois] = useState([]);
    const [weatherData, setWeatherData] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        description: "",
        is_global: false,
        location_id: "",
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPois = async () => {
        try {
            setLoading(true);
            const data = await fetchPoisService();
            setPois(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await createOrUpdatePoi(formData, editingId);
            resetForm();
            setShowEditForm(false);
            setEditingId(null);
            fetchPois();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este POI?")) return;
        try {
            setLoading(true);
            await deletePoiService(id);
            fetchPois();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (poi) => {
        setFormData({
            name: poi.name,
            latitude: poi.latitude?.toString() || "",
            longitude: poi.longitude?.toString() || "",
            description: poi.description || "",
            is_global: poi.is_global,
            location_id: poi.location_id || "",
        });
        setEditingId(poi.id);
        setShowEditForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            latitude: "",
            longitude: "",
            description: "",
            is_global: false,
            location_id: "",
        });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        fetchPois();
    }, []);

    useEffect(() => {
        async function fetchWeatherForPois() {
            const entries = await Promise.all(
                pois.map(async (poi) => {
                    if (!poi.latitude || !poi.longitude) return [poi.id, null];
                    try {
                        const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
                        const res = await fetch(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${poi.latitude}&lon=${poi.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
                        );
                        const data = await res.json();
                        return [
                            poi.id,
                            {
                                temp: data.main?.temp ?? null,
                                description:
                                    data.weather?.[0]?.description ?? "",
                            },
                        ];
                    } catch {
                        return [poi.id, null];
                    }
                })
            );
            setWeatherData(Object.fromEntries(entries));
        }
        if (pois.length > 0) {
            fetchWeatherForPois();
        }
    }, [pois]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0f6fb9]">
                        Points of Interest
                    </h1>
                    <div className="text-sm text-gray-600">
                        {pois.length} points
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-[#fff1f0] border border-[#ffd6d6] text-[#c53030]">
                        {error}
                    </div>
                )}

                {showEditForm && (
                    <div className="mb-6 p-4 bg-white rounded shadow border border-gray-200">
                        <h2 className="text-lg font-bold mb-2">Edit POI</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="border rounded px-3 py-2 w-full"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditingId(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pois.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            No points of interest registered
                        </div>
                    ) : (
                        pois.map((poi) => (
                            <article
                                key={poi.id}
                                className="bg-white rounded-lg shadow p-5 border border-gray-100"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {poi.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {poi.description}
                                        </p>
                                        {weatherData[poi.id] && (
                                            <div className="mt-2 text-blue-700 text-sm">
                                                <span className="font-semibold">
                                                    {weatherData[poi.id].temp}°C
                                                </span>{" "}
                                                <span>
                                                    {
                                                        weatherData[poi.id]
                                                            .description
                                                    }
                                                </span>
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
                                            <dd className="text-xs text-gray-400">{poi.location_id}</dd>
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
                                        onClick={() => handleEdit(poi)}
                                        className="px-3 py-1 rounded-md bg-[#ffd966] text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(poi.id)}
                                        className="px-3 py-1 rounded-md bg-[#d64545] text-white text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

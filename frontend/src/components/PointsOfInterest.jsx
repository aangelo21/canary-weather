import { useState, useEffect } from "react";
import {
    fetchPois as fetchPoisService,
    createOrUpdatePoi,
    deletePoi as deletePoiService,
} from "../services/poiService";
import POIForm from "./POIForm";
import POICard from "./POICard";

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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
            await createOrUpdatePoi(formData, editingId, selectedImage);
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
        // Mostrar preview de la imagen existente si hay
        if (poi.image_url) {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const baseUrl = API_BASE.replace('/api', '');
            setImagePreview(`${baseUrl}${poi.image_url}`);
        } else {
            setImagePreview(null);
        }
        setSelectedImage(null);
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
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                        const OPENWEATHER_API_KEY = import.meta.env
                            .VITE_OPENWEATHER_API_KEY;
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
                        {pois.length} puntos
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-[#fff1f0] border border-[#ffd6d6] text-[#c53030]">
                        {error}
                    </div>
                )}

                {showEditForm && (
                    <POIForm
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                        onCancel={() => {
                            setShowEditForm(false);
                            setEditingId(null);
                        }}
                        onImageChange={handleImageChange}
                        imagePreview={imagePreview}
                    />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pois.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            No hay puntos de interés registrados
                        </div>
                    ) : (
                        pois.map((poi) => (
                            <POICard
                                key={poi.id}
                                poi={poi}
                                weather={weatherData[poi.id]}
                                onEdit={() => handleEdit(poi)}
                                onDelete={() => handleDelete(poi.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

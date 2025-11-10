import { useState, useEffect } from "react";
import {
    fetchPois as fetchPoisService,
    createOrUpdatePoi,
    deletePoi as deletePoiService,
} from "../services/poiService";

export default function PointsOfInterest() {
    const [pois, setPois] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        description: "",
        is_global: false,
        location_id: "",
    });
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0f6fb9]">
                        Puntos de Interés
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pois.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            No hay puntos de interés registrados
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
                                    {poi.latitude && poi.longitude && (
                                        <div className="flex items-center justify-between py-1">
                                            <dt className="font-medium">
                                                Coordenadas
                                            </dt>
                                            <dd>
                                                {poi.latitude}, {poi.longitude}
                                            </dd>
                                        </div>
                                    )}
                                    {poi.location_id && (
                                        <div className="flex items-center justify-between py-1">
                                            <dt className="font-medium">
                                                Ubicación ID
                                            </dt>
                                            <dd className="text-xs text-gray-400">
                                                {poi.location_id}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between py-1">
                                        <dt className="font-medium">Creado</dt>
                                        <dd className="text-sm text-gray-500">
                                            {new Date(
                                                poi.createdAt
                                            ).toLocaleDateString()}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            alert(
                                                "Edición desde el mapa. Añadir/editar se realizará desde el mapa más tarde."
                                            );
                                        }}
                                        className="px-3 py-1 rounded-md bg-[#ffd966] text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(poi.id)}
                                        className="px-3 py-1 rounded-md bg-[#d64545] text-white text-sm"
                                    >
                                        Eliminar
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

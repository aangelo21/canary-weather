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

    // Fetch all POIs
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

    // Create or update POI
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

    // Delete POI
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

    // Edit POI
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

    // Reset form
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

    // Handle input changes
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
        <div className="pois-container">
            <h1>Gestión de Puntos de Interés</h1>

            {error && <div className="error-message">{error}</div>}

            {/* Form */}
            <div className="form-section">
                <h2>{editingId ? "Editar POI" : "Crear Nuevo POI"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Nombre del punto de interés"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="latitude">Latitud</label>
                            <input
                                type="number"
                                id="latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleInputChange}
                                step="any"
                                placeholder="28.1234567"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="longitude">Longitud</label>
                            <input
                                type="number"
                                id="longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleInputChange}
                                step="any"
                                placeholder="-15.1234567"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descripción del punto de interés"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location_id">ID de Ubicación</label>
                        <input
                            type="text"
                            id="location_id"
                            name="location_id"
                            value={formData.location_id}
                            onChange={handleInputChange}
                            placeholder="UUID de la ubicación (opcional)"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_global"
                                checked={formData.is_global}
                                onChange={handleInputChange}
                            />
                            Es POI global
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Guardando..."
                                : editingId
                                ? "Actualizar"
                                : "Crear"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-secondary"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* POIs List */}
            <div className="list-section">
                <h2>Lista de POIs</h2>
                {loading && <div className="loading">Cargando...</div>}

                {pois.length === 0 ? (
                    <p>No hay puntos de interés registrados</p>
                ) : (
                    <div className="pois-grid">
                        {pois.map((poi) => (
                            <div key={poi.id} className="poi-card">
                                <div className="poi-header">
                                    <h3>{poi.name}</h3>
                                    <div className="poi-actions">
                                        <button
                                            onClick={() => handleEdit(poi)}
                                            className="btn-edit"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(poi.id)}
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="poi-info">
                                    {poi.latitude && poi.longitude && (
                                        <p>
                                            <strong>Coordenadas:</strong>{" "}
                                            {poi.latitude}, {poi.longitude}
                                        </p>
                                    )}
                                    {poi.description && (
                                        <p>
                                            <strong>Descripción:</strong>{" "}
                                            {poi.description}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Global:</strong>{" "}
                                        {poi.is_global ? "Sí" : "No"}
                                    </p>
                                    {poi.location_id && (
                                        <p>
                                            <strong>Ubicación ID:</strong>{" "}
                                            {poi.location_id}
                                        </p>
                                    )}
                                    <p>
                                        <strong>ID:</strong> {poi.id}
                                    </p>
                                    <p>
                                        <strong>Creado:</strong>{" "}
                                        {new Date(
                                            poi.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

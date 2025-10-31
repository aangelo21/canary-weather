import { useState, useEffect } from "react";
import {
    fetchUsers as fetchUsersService,
    createOrUpdateUser,
    deleteUser as deleteUserService,
} from "../services/userService";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsersService();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create or update user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await createOrUpdateUser(formData, editingId);
            resetForm();
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete user
    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
        try {
            setLoading(true);
            await deleteUserService(id);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Edit user
    const handleEdit = (user) => {
        setFormData({
            email: user.email,
            username: user.username || "",
            password: "", // Don't prefill password for security
        });
        setEditingId(user.id);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            email: "",
            username: "",
            password: "",
        });
        setEditingId(null);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="users-container">
            <h1>Gestión de Usuarios</h1>

            {error && <div className="error-message">{error}</div>}

            {/* Form */}
            <div className="form-section">
                <h2>{editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="usuario@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="nombre_usuario"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Contraseña{" "}
                            {editingId
                                ? "(dejar vacío para mantener actual)"
                                : "*"}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required={!editingId}
                            placeholder="Contraseña"
                        />
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

            {/* Users List */}
            <div className="list-section">
                <h2>Lista de Usuarios</h2>
                {loading && <div className="loading">Cargando...</div>}

                {users.length === 0 ? (
                    <p>No hay usuarios registrados</p>
                ) : (
                    <div className="users-grid">
                        {users.map((user) => (
                            <div key={user.id} className="user-card">
                                <div className="user-header">
                                    <h3>{user.username || user.email}</h3>
                                    <div className="user-actions">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="btn-edit"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="user-info">
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    {user.username && (
                                        <p>
                                            <strong>Usuario:</strong>{" "}
                                            {user.username}
                                        </p>
                                    )}
                                    <p>
                                        <strong>ID:</strong> {user.id}
                                    </p>
                                    <p>
                                        <strong>Creado:</strong>{" "}
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Actualizado:</strong>{" "}
                                        {new Date(
                                            user.updatedAt
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

import { useState, useEffect } from "react";
import {
    createOrUpdateUser,
    loginUser,
    deleteUser,
} from "../services/userService";

export default function LoginModal({
    isOpen,
    onClose,
    onLogin,
    user,
    onLogout,
}) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [input, setInput] = useState({
        emailOrUsername: "",
        password: "",
        username: "",
        email: "",
        confirm: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setInput({
                email: user.email || "",
                username: user.username || "",
                password: "",
                confirm: "",
                emailOrUsername: "",
            });
        }
    }, [user, isOpen]);
    if (!isOpen) return null;
    if (showDeleteConfirm) {
        return (
            <>
                <div className="fixed inset-0 z-9998" onClick={() => setShowDeleteConfirm(false)}></div>
                <div className="fixed inset-0 flex items-center justify-center z-9999 p-4" onClick={() => setShowDeleteConfirm(false)}>
                <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-2 right-2 text-neutral-2 hover:text-neutral-1"
                        onClick={() => setShowDeleteConfirm(false)}
                        type="button"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Eliminar Cuenta
                    </h2>
                    <p className="text-center mb-6">
                        ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
                    </p>
                    {error && (
                        <div className="text-error text-sm mb-2 text-center">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="text-info text-sm mb-2 text-center">
                            Eliminando cuenta...
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            className="bg-neutral-2 text-white px-4 py-2 rounded hover:bg-neutral-1 flex-1"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await deleteUser(user.id);
                                    setLoading(false);
                                    onLogout();
                                    onClose();
                                } catch (err) {
                                    setLoading(false);
                                    setError(err.message || "Error al eliminar usuario");
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
                </div>
            </>
        );
    }
    if (user) {
        return (
            <>
                <div className="fixed inset-0 z-9998" onClick={onClose}></div>
                <div className="fixed inset-0 flex items-center justify-center z-9999 p-4" onClick={onClose}>
                <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        type="button"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Editar Cuenta
                    </h2>
                    {error && (
                        <div className="text-error text-sm mb-2 text-center">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="text-info text-sm mb-2 text-center">
                            Procesando...
                        </div>
                    )}
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError("");
                            if (
                                input.password &&
                                input.password !== input.confirm
                            ) {
                                setError("Las contraseñas no coinciden");
                                return;
                            }
                            setLoading(true);
                            try {
                                const updateData = {};
                                if (input.email.trim())
                                    updateData.email = input.email;
                                if (input.username.trim())
                                    updateData.username = input.username;
                                if (input.password)
                                    updateData.password = input.password;
                                const result = await createOrUpdateUser(
                                    updateData,
                                    user.id
                                );
                                setLoading(false);
                                if (result) {
                                    onLogin(result);
                                    onClose();
                                }
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || "Error al actualizar usuario");
                            }
                        }}
                    >
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            className="border rounded px-3 py-2"
                            value={input.email}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    email: e.target.value,
                                }))
                            }
                        />
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            className="border rounded px-3 py-2"
                            value={input.username}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    username: e.target.value,
                                }))
                            }
                        />
                        <input
                            type="password"
                            placeholder="Nueva Contraseña (opcional)"
                            className="border rounded px-3 py-2"
                            value={input.password}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    password: e.target.value,
                                }))
                            }
                        />
                        <input
                            type="password"
                            placeholder="Confirmar Nueva Contraseña"
                            className="border rounded px-3 py-2"
                            value={input.confirm}
                            onChange={(e) =>
                                setInput((i) => ({
                                    ...i,
                                    confirm: e.target.value,
                                }))
                            }
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
                            disabled={loading}
                        >
                            {loading ? "Actualizando..." : "Actualizar Cuenta"}
                        </button>
                    </form>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full mt-4"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Eliminar Cuenta
                    </button>
                </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-9998" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-9999 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    type="button"
                >
                    &times;
                </button>
                <div className="mb-2 text-sm text-center">
                    {!isSignUp ? (
                        <span>
                            ¿No tienes una cuenta con nosotros?{" "}
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => setIsSignUp(true)}
                            >
                                Registrarse
                            </button>
                        </span>
                    ) : (
                        <span>
                            ¿Ya tienes una cuenta?{" "}
                            <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() => setIsSignUp(false)}
                            >
                                Iniciar Sesión
                            </button>
                        </span>
                    )}
                </div>
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {isSignUp ? "Registrarse" : "Iniciar Sesión"}
                </h2>
                {error && (
                    <div className="text-error text-sm mb-2 text-center">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="text-info text-sm mb-2 text-center">
                        Procesando...
                    </div>
                )}
                <form
                    className="flex flex-col gap-4"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError("");
                        if (isSignUp) {
                            if (
                                !input.email ||
                                !input.username ||
                                !input.password ||
                                !input.confirm
                            ) {
                                setError("Todos los campos son obligatorios");
                                return;
                            }
                            if (input.password !== input.confirm) {
                                setError("Las contraseñas no coinciden");
                                return;
                            }
                            setLoading(true);
                            try {
                                const result = await createOrUpdateUser({
                                    email: input.email,
                                    username: input.username,
                                    password: input.password,
                                });
                                setLoading(false);
                                if (result && result.token) {
                                    localStorage.setItem(
                                        "authToken",
                                        result.token
                                    );
                                    let loggedUser = {
                                        username: input.username,
                                    };
                                    if (result.user) loggedUser = result.user;
                                    else if (
                                        result.id ||
                                        result.username ||
                                        result.email
                                    ) {
                                        loggedUser = {
                                            id: result.id,
                                            username:
                                                result.username ||
                                                input.username,
                                            email: result.email,
                                        };
                                    }
                                    if (loggedUser.id)
                                        localStorage.setItem(
                                            "userId",
                                            loggedUser.id
                                        );
                                    onLogin(loggedUser);
                                } else {
                                    onLogin(result);
                                }
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || "Error al crear usuario");
                            }
                        } else {
                            if (!input.emailOrUsername || !input.password) {
                                setError("Todos los campos son obligatorios");
                                return;
                            }
                            setLoading(true);
                            try {
                                const result = await loginUser({
                                    username: input.emailOrUsername,
                                    password: input.password,
                                });
                                setLoading(false);
                                if (result.token) {
                                    localStorage.setItem(
                                        "authToken",
                                        result.token
                                    );
                                    let loggedUser = {
                                        username: input.emailOrUsername,
                                    };
                                    if (result.user) loggedUser = result.user;
                                    else if (
                                        result.id ||
                                        result.username ||
                                        result.email
                                    ) {
                                        loggedUser = {
                                            id: result.id,
                                            username:
                                                result.username ||
                                                input.emailOrUsername,
                                            email: result.email,
                                        };
                                    }
                                    if (loggedUser.id)
                                        localStorage.setItem(
                                            "userId",
                                            loggedUser.id
                                        );
                                    onLogin(loggedUser);
                                } else {
                                    setError("No se recibió token");
                                }
                            } catch (err) {
                                setLoading(false);
                                setError(err.message || "Error al iniciar sesión");
                            }
                        }
                    }}
                >
                    {isSignUp ? (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                className="border rounded px-3 py-2"
                                value={input.email}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        email: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="border rounded px-3 py-2"
                                value={input.username}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        username: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="border rounded px-3 py-2"
                                value={input.password}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        password: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="border rounded px-3 py-2"
                                value={input.password}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        password: e.target.value,
                                    }))
                                }
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Correo Electrónico o Nombre de Usuario"
                                className="border rounded px-3 py-2"
                                value={input.emailOrUsername}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        emailOrUsername: e.target.value,
                                    }))
                                }
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="border rounded px-3 py-2"
                                value={input.password}
                                onChange={(e) =>
                                    setInput((i) => ({
                                        ...i,
                                        password: e.target.value,
                                    }))
                                }
                            />
                        </>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isSignUp ? "Registrarse" : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
            </div>
        </>
    );
}

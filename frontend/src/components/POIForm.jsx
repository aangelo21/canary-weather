export default function POIForm({
    formData,
    onChange,
    onSubmit,
    loading,
    onCancel,
    onImageChange,
    imagePreview,
}) {
    return (
        <div className="mb-6 p-4 bg-white rounded shadow border border-gray-200">
            <h2 className="text-lg font-bold mb-2">Editar POI</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        className="border rounded px-3 py-2 w-full"
                        rows={3}
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        Imagen del POI
                    </label>
                    <input
                        type="file"
                        name="poi_image"
                        accept="image/*"
                        onChange={onImageChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img
                                src={imagePreview}
                                alt="Vista Previa"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}
                </div>
                <div className="flex gap-2 mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function POIForm({
    formData,
    onChange,
    onSubmit,
    loading,
    onCancel,
}) {
    return (
        <div className="mb-6 p-4 bg-white rounded shadow border border-gray-200">
            <h2 className="text-lg font-bold mb-2">Edit POI</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        Name
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
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
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
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

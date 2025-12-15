import { useTranslation } from 'react-i18next';


export default function POIForm({
    formData,
    onChange,
    onSubmit,
    loading,
    onCancel,
    onImageChange,
    imagePreview,
}) {
    const { t } = useTranslation();
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label
                        htmlFor="poi-name"
                        className="block text-sm font-medium mb-1"
                    >
                        {t('name')}
                    </label>
                    <input
                        id="poi-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label
                        htmlFor="poi-description"
                        className="block text-sm font-medium mb-1"
                    >
                        {t('description')}
                    </label>
                    <textarea
                        id="poi-description"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        rows={3}
                        className="border rounded px-3 py-2 w-full"
                        placeholder={t('description')}
                    />
                </div>

                <div className="mb-2">
                    <label
                        htmlFor="poi-image"
                        className="block text-sm font-medium mb-1"
                    >
                        {t('poiImage')}
                    </label>
                    <input
                        id="poi-image"
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
                                alt={t('preview')}
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
                        {loading ? t('saving') : t('save')}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        {t('cancel')}
                    </button>
                </div>
            </form>
        </div>
    );
}

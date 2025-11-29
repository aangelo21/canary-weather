import { useTranslation } from 'react-i18next';

/**
 * POIForm component.
 * Provides a form for creating or editing Points of Interest (POIs).
 * It includes fields for name, description, and image upload with preview functionality.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.formData - The current form data object.
 * @param {Function} props.onChange - Function to handle input changes.
 * @param {Function} props.onSubmit - Function to handle form submission.
 * @param {boolean} props.loading - Loading state for the submit button.
 * @param {Function} props.onCancel - Function to cancel editing.
 * @param {Function} props.onImageChange - Function to handle image file selection.
 * @param {string} props.imagePreview - URL for the image preview.
 * @returns {JSX.Element} The rendered POIForm component.
 */
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
                    <label className="block text-sm font-medium mb-1">
                        {t('name')}
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
                        {t('description')}
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        rows={3}
                        className="border rounded px-3 py-2 w-full"
                        placeholder={t('description')}
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        {t('poiImage')}
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

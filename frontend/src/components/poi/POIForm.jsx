import { useTranslation } from 'react-i18next';

/**
 * POIForm Component.
 *
 * A reusable form component for creating and editing Points of Interest (POIs).
 *
 * Features:
 * - **Input Fields**: Name (text), Description (textarea), and Image (file input).
 * - **Image Preview**: Displays a preview of the selected image before upload.
 * - **Validation**: Basic HTML5 validation (required fields).
 * - **Loading State**: Disables the submit button while the request is processing.
 * - **Internationalization**: Uses `useTranslation` for all labels and button text.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.formData - The current state of the form fields.
 * @param {string} props.formData.name - The name of the POI.
 * @param {string} props.formData.description - The description of the POI.
 * @param {Function} props.onChange - Callback function to handle text input changes.
 * @param {Function} props.onSubmit - Callback function to handle form submission.
 * @param {boolean} props.loading - Boolean indicating if a submission is in progress.
 * @param {Function} props.onCancel - Callback function to handle the cancel action.
 * @param {Function} props.onImageChange - Callback function to handle file input changes.
 * @param {string|null} props.imagePreview - URL of the image to preview (either a local object URL or a remote URL).
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

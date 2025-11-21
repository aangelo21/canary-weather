// POIForm.jsx - Point of Interest form component
// This component provides a form for creating or editing Points of Interest (POIs).
// It includes fields for name, description, and image upload with preview functionality.
// Used in the Points of Interest page for POI management.

import { useTranslation } from "react-i18next";

export default function POIForm({
  formData, // Current form data object
  onChange, // Function to handle input changes
  onSubmit, // Function to handle form submission
  loading, // Loading state for submit button
  onCancel, // Function to cancel editing
  onImageChange, // Function to handle image file selection
  imagePreview, // URL for image preview
}) {
    const { t } = useTranslation();
    return (
        // Form container
        <div>
            {/* Main form element */}
            <form onSubmit={onSubmit}>
                {/* Name input field */}
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

                {/* Description textarea field */}
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        {t('description')}
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        className="border rounded px-3 py-2 w-full"
                        rows={3}
                    />
                </div>

                {/* Image upload field with preview */}
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        {t('poiImage')}
                    </label>
                    <input
                        type="file"
                        name="poi_image"
                        accept="image/*"  // Only accept image files
                        onChange={onImageChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                    {/* Image preview section - only shown when image is selected */}
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

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                    {/* Submit button with loading state */}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? t('saving') : t('save')}
                    </button>
                    {/* Cancel button */}
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

// POICard.jsx - Point of Interest card component
// This component displays a single Point of Interest (POI) in a card format,
// showing its image, name, description, weather data, location info, and action buttons.
// Used in the Points of Interest page to display individual POI items.

import { useTranslation } from "react-i18next";

export default function POICard({ poi, weather, onEdit, onDelete }) {
  const { t } = useTranslation();
  // Get API base URL from environment variables
  const API_BASE = import.meta.env.VITE_API_BASE;
  // Remove '/api' suffix to get the base URL for static assets
  const baseUrl = API_BASE?.replace("/api", "") || "";
  // Construct full image URL if POI has an image
  const imageUrl = poi.image_url ? `${baseUrl}${poi.image_url}` : null;

  return (
    // Main card container with white background, rounded corners, shadow, and border
    <article className="bg-white rounded-lg shadow p-5 border border-gray-100">
      {/* Image section */}
      <div className="mb-4">
        {imageUrl ? (
          // Display POI image if available
          <img
            src={imageUrl}
            alt={poi.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              // Fallback to placeholder image if image fails to load
              e.target.src =
                "https://via.placeholder.com/400x300/0f6fb9/ffffff?text=No+Image";
            }}
          />
        ) : (
          // Placeholder div with gradient background when no image
          <div className="w-full h-48 bg-linear-to-br from-[#0f6fb9] to-[#0a5a96] rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              {/* Camera icon SVG */}
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {/* "No Image" text */}
              <p className="text-sm font-medium opacity-80">{t('noImage')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main content section with POI info and global/local badge */}
      <div className="flex justify-between items-start">
        <div>
          {/* POI name and description */}
          <h3 className="text-lg font-semibold text-gray-800">{poi.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{poi.description}</p>
          {/* Weather information if available */}
          {weather && (
            <div className="mt-2 text-blue-700 text-sm">
              <span className="font-semibold">{weather.temp}°C</span>{" "}
              <span>{weather.description}</span>
            </div>
          )}
        </div>
        {/* Global/Local indicator badge */}
        <div className="text-right">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              poi.is_global
                ? "bg-[#f2c200] text-black" // Yellow badge for global POIs
                : "bg-[#0f6fb9] text-white" // Blue badge for local POIs
            }`}
          >
            {poi.is_global ? t('global') : t('local')}
          </span>
        </div>
      </div>

      {/* Metadata section with location and creation info */}
      <dl className="mt-4 text-sm text-gray-600">
        {/* Latitude display */}
        {poi.latitude && (
          <div className="flex items-center justify-between py-1">
            <dt className="font-medium">{t('latitude')}</dt>
            <dd>{poi.latitude}</dd>
          </div>
        )}
        {/* Longitude display */}
        {poi.longitude && (
          <div className="flex items-center justify-between py-1">
            <dt className="font-medium">{t('longitude')}</dt>
            <dd>{poi.longitude}</dd>
          </div>
        )}
        {/* Location ID display */}
        {poi.location_id && (
          <div className="flex items-center justify-between py-1">
            <dt className="font-medium">{t('locationId')}</dt>
            <dd className="text-xs text-gray-400">{poi.location_id}</dd>
          </div>
        )}
        {/* Creation date */}
        <div className="flex items-center justify-between py-1">
          <dt className="font-medium">{t('created')}</dt>
          <dd className="text-sm text-gray-500">
            {new Date(poi.createdAt).toLocaleDateString()}
          </dd>
        </div>
      </dl>

      {/* Action buttons section */}
      <div className="mt-4 flex items-center justify-end gap-2">
        {/* Edit button */}
        <button
          onClick={onEdit}
          className="px-3 py-1 rounded-md bg-[#ffd966] text-sm"
        >
          {t('edit')}
        </button>
        {/* Delete button */}
        <button
          onClick={onDelete}
          className="px-3 py-1 rounded-md bg-[#d64545] text-white text-sm"
        >
          {t('delete')}
        </button>
      </div>
    </article>
  );
}

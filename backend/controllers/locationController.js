// Import Location and related models for associations
import {
  Location,
  Forecast,
  Alert,
  Tide,
  PointOfInterest,
} from "../models/index.js";

/**
 * Retrieves all locations from the database.
 *
 * This function fetches all location records. It uses the `raw: true` and `nest: true`
 * options to return plain JavaScript objects instead of Sequelize instances,
 * which improves performance for read-only operations.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the list of locations.
 */
export const getAllLocations = async (req, res) => {
  try {
    // Fetch all locations from database with performance optimization
    const locations = await Location.findAll({
      raw: true,
      nest: true,
    });
    return res.json(locations);
  } catch (err) {
    console.error("Error in getAllLocations:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves a specific location by its ID, including related data.
 *
 * This function fetches a single location record by its primary key (ID).
 * It includes associated Forecasts, Alerts, Tides, and Points of Interest.
 *
 * @param {Object} req - The request object, containing the location ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the location details or an error message.
 */
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find location by ID and include associated forecasts, alerts, tides, and POIs
    // Using plain objects for performance since we are just reading data
    const location = await Location.findByPk(id, {
      include: [Forecast, Alert, Tide, PointOfInterest],
      // Note: 'raw: true' with 'include' can sometimes duplicate rows or flatten structure in unexpected ways depending on Sequelize version.
      // For complex includes, it's often safer to use default instances or careful 'nest: true'.
      // Here we keep it standard for safety with includes, but could optimize further if needed.
    });
    if (!location) return res.status(404).json({ error: "Location not found" });
    return res.json(location);
  } catch (err) {
    console.error(`Error in getLocationById for id ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Creates a new location.
 *
 * This function creates a new location record in the database using the data provided in the request body.
 *
 * @param {Object} req - The request object, containing the location data in `req.body`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the created location.
 */
export const createLocation = async (req, res) => {
  try {
    const payload = req.body;
    // Create new location with provided data
    const location = await Location.create(payload);
    return res.status(201).json(location);
  } catch (err) {
    console.error("Error in createLocation:", err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Updates an existing location.
 *
 * This function updates a location record identified by its ID with the data provided in the request body.
 * It first performs the update and then fetches the updated record to return it.
 *
 * @param {Object} req - The request object, containing the location ID in `req.params` and update data in `req.body`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the updated location.
 */
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // Update location in database
    const [updated] = await Location.update(payload, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Location not found" });
    // Fetch and return updated location
    const updatedLocation = await Location.findByPk(id);
    return res.json(updatedLocation);
  } catch (err) {
    console.error(`Error in updateLocation for id ${req.params.id}:`, err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletes a location.
 *
 * This function deletes a location record identified by its ID from the database.
 *
 * @param {Object} req - The request object, containing the location ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a 204 No Content response on success.
 */
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete location by ID
    const deleted = await Location.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Location not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    console.error(`Error in deleteLocation for id ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves all forecasts for a specific location.
 *
 * This function fetches all forecast records associated with a given location ID.
 * It uses `raw: true` and `nest: true` for performance.
 *
 * @param {Object} req - The request object, containing the location ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the list of forecasts.
 */
export const getLocationForecasts = async (req, res) => {
  try {
    const { id } = req.params;
    // Find all forecasts associated with the location
    const forecasts = await Forecast.findAll({
      where: { location_id: id },
      raw: true,
      nest: true,
    });
    return res.json(forecasts);
  } catch (err) {
    console.error(`Error in getLocationForecasts for id ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves all alerts for a specific location.
 *
 * This function fetches all alert records associated with a given location ID.
 * It uses `raw: true` and `nest: true` for performance.
 *
 * @param {Object} req - The request object, containing the location ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the list of alerts.
 */
export const getLocationAlerts = async (req, res) => {
  try {
    const { id } = req.params;
    // Find all alerts associated with the location
    const alerts = await Alert.findAll({
      where: { location_id: id },
      raw: true,
      nest: true,
    });
    return res.json(alerts);
  } catch (err) {
    console.error(`Error in getLocationAlerts for id ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get tides for a specific location
export const getLocationTides = async (req, res) => {
  try {
    const { id } = req.params;
    // Find all tides associated with the location
    const tides = await Tide.findAll({ where: { location_id: id } });
    return res.json(tides);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

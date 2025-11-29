import { Forecast, PointOfInterest } from "../models/index.js";

/**
 * Retrieves all forecasts from the database.
 *
 * This function fetches all forecast records. It uses `raw: true` and `nest: true`
 * for performance optimization, returning plain JavaScript objects.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the list of forecasts.
 */
export const getAllForecasts = async (req, res) => {
  try {
    const items = await Forecast.findAll({
      raw: true,
      nest: true,
    });
    return res.json(items);
  } catch (err) {
    console.error("Error in getAllForecasts:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves a specific forecast by its ID.
 *
 * This function fetches a single forecast record by its primary key (ID).
 * It includes the associated Point of Interest.
 *
 * @param {Object} req - The request object, containing the forecast ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the forecast details.
 */
export const getForecastById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Forecast.findByPk(id, {
      include: [PointOfInterest],
    });
    if (!item) return res.status(404).json({ error: "Forecast not found" });
    return res.json(item);
  } catch (err) {
    console.error(`Error in getForecastById for id ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Creates a new forecast.
 *
 * This function creates a new forecast record in the database using the data provided in the request body.
 *
 * @param {Object} req - The request object, containing the forecast data in `req.body`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the created forecast.
 */
export const createForecast = async (req, res) => {
  try {
    const payload = req.body;
    const item = await Forecast.create(payload);
    return res.status(201).json(item);
  } catch (err) {
    console.error("Error in createForecast:", err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Updates an existing forecast.
 *
 * This function updates a forecast record identified by its ID with the data provided in the request body.
 *
 * @param {Object} req - The request object, containing the forecast ID in `req.params` and update data in `req.body`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the updated forecast.
 */
export const updateForecast = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const [updated] = await Forecast.update(payload, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Forecast not found" });
    const updatedItem = await Forecast.findByPk(id);
    return res.json(updatedItem);
  } catch (err) {
    console.error(`Error in updateForecast for id ${req.params.id}:`, err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletes a forecast.
 *
 * This function deletes a forecast record identified by its ID from the database.
 *
 * @param {Object} req - The request object, containing the forecast ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a 204 No Content response on success.
 */
export const deleteForecast = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Forecast.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Forecast not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(`Error in deleteForecast for id ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves all forecasts for a specific Point of Interest (POI).
 *
 * This function fetches all forecast records associated with a given POI ID.
 * It uses `raw: true` and `nest: true` for performance.
 *
 * @param {Object} req - The request object, containing the POI ID in `req.params`.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to a JSON response containing the list of forecasts.
 */
export const getForecastsByPOI = async (req, res) => {
  try {
    const { poiId } = req.params;
    const items = await Forecast.findAll({
      where: { poi_id: poiId },
      raw: true,
      nest: true,
    });
    return res.json(items);
  } catch (err) {
    console.error(`Error in getForecastsByPOI for poiId ${req.params.poiId}:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

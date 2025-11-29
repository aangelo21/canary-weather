import { Alert } from "../models/index.js";
import { fetchAndStoreWarnings } from "../services/meteoalarmService.js";

/**
 * Alert Controller
 * 
 * Manages weather alerts and warnings.
 * Handles CRUD operations for alerts and triggers the external fetching service.
 */

/**
 * Retrieves all alerts.
 * 
 * Fetches a list of all weather alerts currently stored in the database.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing an array of alerts.
 */
export const getAllAlerts = async (req, res) => {
  try {
    const items = await Alert.findAll();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a specific alert by ID.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the alert to retrieve.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the alert object or a 404 error.
 */
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Alert.findByPk(id);
    if (!item) return res.status(404).json({ error: "Alert not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a new alert manually.
 * 
 * Typically used for testing or manual overrides, as most alerts come from the external service.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The alert data.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the created alert.
 */
export const createAlert = async (req, res) => {
  try {
    const payload = req.body;
    const item = await Alert.create(payload);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Updates an existing alert.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the alert to update.
 * @param {Object} req.body - The updated alert data.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the updated alert or a 404 error.
 */
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const [updated] = await Alert.update(payload, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Alert not found" });
    const updatedItem = await Alert.findByPk(id);
    return res.json(updatedItem);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletes an alert.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the alert to delete.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} 204 No Content response on success or a 404 error.
 */
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Alert.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Alert not found" });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Triggers the external warning fetch process.
 * 
 * Calls the `meteoalarmService` to scrape or fetch the latest warnings
 * from the external provider and update the database.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response confirming the operation.
 */
export const fetchWarnings = async (req, res) => {
  try {
    await fetchAndStoreWarnings();
    return res.json({ message: 'Warnings fetched and stored successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

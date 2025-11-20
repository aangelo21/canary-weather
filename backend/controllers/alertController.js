// Import Alert and Location models
import { Alert, Location } from "../models/index.js";
import { fetchAndStoreWarnings } from "../services/aemetService.js";

// Controller function to get all alerts
export const getAllAlerts = async (req, res) => {
  try {
    // Fetch all alerts from database
    const items = await Alert.findAll();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get a specific alert by ID
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find alert by ID and include associated Location data
    const item = await Alert.findByPk(id, { include: [Location] });
    if (!item) return res.status(404).json({ error: "Alert not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to create a new alert
export const createAlert = async (req, res) => {
  try {
    const payload = req.body;
    // Create new alert with provided data
    const item = await Alert.create(payload);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to update an existing alert
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // Update alert in database
    const [updated] = await Alert.update(payload, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Alert not found" });
    // Fetch and return updated alert
    const updatedItem = await Alert.findByPk(id);
    return res.json(updatedItem);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to delete an alert
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete alert by ID
    const deleted = await Alert.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Alert not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get alerts by location
export const getAlertsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    // Find all alerts associated with the given location
    const items = await Alert.findAll({
      where: { location_id: locationId },
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to fetch and store warnings from AEMET
export const fetchWarnings = async (req, res) => {
  try {
    await fetchAndStoreWarnings();
    return res.json({ message: 'Warnings fetched and stored successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

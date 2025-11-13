// Import Forecast and Location models
import { Forecast, Location } from "../models/index.js";

// Controller function to get all forecasts
export const getAllForecasts = async (req, res) => {
    try {
        // Fetch all forecasts from database
        const items = await Forecast.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get a specific forecast by ID
export const getForecastById = async (req, res) => {
    try {
        const { id } = req.params;
        // Find forecast by ID and include associated Location data
        const item = await Forecast.findByPk(id, { include: [Location] });
        if (!item) return res.status(404).json({ error: "Forecast not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to create a new forecast
export const createForecast = async (req, res) => {
    try {
        const payload = req.body;
        // Create new forecast with provided data
        const item = await Forecast.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to update an existing forecast
export const updateForecast = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        // Update forecast in database
        const [updated] = await Forecast.update(payload, { where: { id } });
        if (!updated)
            return res.status(404).json({ error: "Forecast not found" });
        // Fetch and return updated forecast
        const updatedItem = await Forecast.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to delete a forecast
export const deleteForecast = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete forecast by ID
        const deleted = await Forecast.destroy({ where: { id } });
        if (!deleted)
            return res.status(404).json({ error: "Forecast not found" });
        // Return 204 No Content on success
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get forecasts by location
export const getForecastsByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        // Find all forecasts associated with the given location
        const items = await Forecast.findAll({
            where: { location_id: locationId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

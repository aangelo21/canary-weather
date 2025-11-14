// Import Location and related models for associations
import {
    Location,
    Forecast,
    Alert,
    Tide,
    PointOfInterest,
} from "../models/index.js";

// Controller function to get all locations
export const getAllLocations = async (req, res) => {
    try {
        // Fetch all locations from database
        const locations = await Location.findAll();
        return res.json(locations);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get a specific location by ID with related data
export const getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        // Find location by ID and include associated forecasts, alerts, tides, and POIs
        const location = await Location.findByPk(id, {
            include: [Forecast, Alert, Tide, PointOfInterest],
        });
        if (!location)
            return res.status(404).json({ error: "Location not found" });
        return res.json(location);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to create a new location
export const createLocation = async (req, res) => {
    try {
        const payload = req.body;
        // Create new location with provided data
        const location = await Location.create(payload);
        return res.status(201).json(location);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to update an existing location
export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        // Update location in database
        const [updated] = await Location.update(payload, { where: { id } });
        if (!updated)
            return res.status(404).json({ error: "Location not found" });
        // Fetch and return updated location
        const updatedLocation = await Location.findByPk(id);
        return res.json(updatedLocation);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to delete a location
export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete location by ID
        const deleted = await Location.destroy({ where: { id } });
        if (!deleted)
            return res.status(404).json({ error: "Location not found" });
        // Return 204 No Content on success
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get forecasts for a specific location
export const getLocationForecasts = async (req, res) => {
    try {
        const { id } = req.params;
        // Find all forecasts associated with the location
        const forecasts = await Forecast.findAll({
            where: { location_id: id },
        });
        return res.json(forecasts);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get alerts for a specific location
export const getLocationAlerts = async (req, res) => {
    try {
        const { id } = req.params;
        // Find all alerts associated with the location
        const alerts = await Alert.findAll({ where: { location_id: id } });
        return res.json(alerts);
    } catch (err) {
        return res.status(500).json({ error: err.message });
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

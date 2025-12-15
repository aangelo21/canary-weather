import { Location, Forecast, Alert, PointOfInterest } from '../models/index.js';

export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll({
            raw: true,
            nest: true,
        });
        return res.json(locations);
    } catch (err) {
        console.error('Error in getAllLocations:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findByPk(id, {
            include: [Forecast, Alert, PointOfInterest],
        });
        if (!location)
            return res.status(404).json({ error: 'Location not found' });
        return res.json(location);
    } catch (err) {
        console.error(`Error in getLocationById for id ${req.params.id}:`, err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createLocation = async (req, res) => {
    try {
        const payload = req.body;
        const location = await Location.create(payload);
        return res.status(201).json(location);
    } catch (err) {
        console.error('Error in createLocation:', err);
        return res.status(400).json({ error: err.message });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const [updated] = await Location.update(payload, { where: { id } });
        if (!updated)
            return res.status(404).json({ error: 'Location not found' });
        const updatedLocation = await Location.findByPk(id);
        return res.json(updatedLocation);
    } catch (err) {
        console.error(`Error in updateLocation for id ${req.params.id}:`, err);
        return res.status(400).json({ error: err.message });
    }
};

export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Location.destroy({ where: { id } });
        if (!deleted)
            return res.status(404).json({ error: 'Location not found' });
        return res.status(204).send();
    } catch (err) {
        console.error(`Error in deleteLocation for id ${req.params.id}:`, err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLocationForecasts = async (req, res) => {
    try {
        const { id } = req.params;
        const forecasts = await Forecast.findAll({
            where: { location_id: id },
            raw: true,
            nest: true,
        });
        return res.json(forecasts);
    } catch (err) {
        console.error(
            `Error in getLocationForecasts for id ${req.params.id}:`,
            err,
        );
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLocationAlerts = async (req, res) => {
    try {
        const { id } = req.params;
        const alerts = await Alert.findAll({
            where: { location_id: id },
            raw: true,
            nest: true,
        });
        return res.json(alerts);
    } catch (err) {
        console.error(
            `Error in getLocationAlerts for id ${req.params.id}:`,
            err,
        );
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLocationTides = async (req, res) => {
    try {
        const { id } = req.params;
        const tides = await Tide.findAll({ where: { location_id: id } });
        return res.json(tides);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

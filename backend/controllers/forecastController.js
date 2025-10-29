import { Forecast, Location } from "../models/index.js";

export const getAllForecasts = async (req, res) => {
    try {
        const items = await Forecast.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getForecastById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Forecast.findByPk(id, { include: [Location] });
        if (!item) return res.status(404).json({ error: "Forecast not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createForecast = async (req, res) => {
    try {
        const payload = req.body;
        const item = await Forecast.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateForecast = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const [updated] = await Forecast.update(payload, { where: { id } });
        if (!updated)
            return res.status(404).json({ error: "Forecast not found" });
        const updatedItem = await Forecast.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const deleteForecast = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Forecast.destroy({ where: { id } });
        if (!deleted)
            return res.status(404).json({ error: "Forecast not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getForecastsByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const items = await Forecast.findAll({
            where: { location_id: locationId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

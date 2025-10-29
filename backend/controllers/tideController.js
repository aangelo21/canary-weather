import { Tide, CoastCode, Location } from "../models/index.js";

export const getAllTides = async (req, res) => {
    try {
        const items = await Tide.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getTideById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Tide.findByPk(id, {
            include: [CoastCode, Location],
        });
        if (!item) return res.status(404).json({ error: "Tide not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createTide = async (req, res) => {
    try {
        const payload = req.body;
        const item = await Tide.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateTide = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const [updated] = await Tide.update(payload, { where: { id } });
        if (!updated) return res.status(404).json({ error: "Tide not found" });
        const updatedItem = await Tide.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const deleteTide = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Tide.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: "Tide not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getTidesByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const items = await Tide.findAll({
            where: { location_id: locationId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

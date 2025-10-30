import { CoastCode, Location, Tide } from "../models/index.js";

export const getAllCoastCodes = async (req, res) => {
    try {
        const items = await CoastCode.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getCoastCodeById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CoastCode.findByPk(id, {
            include: [Location, Tide],
        });
        if (!item)
            return res.status(404).json({ error: "CoastCode not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createCoastCode = async (req, res) => {
    try {
        const payload = req.body;
        const item = await CoastCode.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateCoastCode = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const [updated] = await CoastCode.update(payload, { where: { id } });
        if (!updated)
            return res.status(404).json({ error: "CoastCode not found" });
        const updatedItem = await CoastCode.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const deleteCoastCode = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await CoastCode.destroy({ where: { id } });
        if (!deleted)
            return res.status(404).json({ error: "CoastCode not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

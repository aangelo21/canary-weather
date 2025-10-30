import { PointOfInterest, Location } from "../models/index.js";

export const getAllPointsOfInterest = async (req, res) => {
    try {
        const items = await PointOfInterest.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getPointOfInterestById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await PointOfInterest.findByPk(id, {
            include: [Location],
        });
        if (!item)
            return res.status(404).json({ error: "PointOfInterest not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createPointOfInterest = async (req, res) => {
    try {
        const payload = req.body;
        const item = await PointOfInterest.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updatePointOfInterest = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const [updated] = await PointOfInterest.update(payload, {
            where: { id },
        });
        if (!updated)
            return res.status(404).json({ error: "PointOfInterest not found" });
        const updatedItem = await PointOfInterest.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const deletePointOfInterest = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PointOfInterest.destroy({ where: { id } });
        if (!deleted)
            return res.status(404).json({ error: "PointOfInterest not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getPointsByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const items = await PointOfInterest.findAll({
            where: { location_id: locationId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Import Tide, CoastCode, and Location models
import { Tide, CoastCode, Location } from "../models/index.js";

// Controller function to get all tides
export const getAllTides = async (req, res) => {
    try {
        // Fetch all tides from database
        const items = await Tide.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get a specific tide by ID
export const getTideById = async (req, res) => {
    try {
        const { id } = req.params;
        // Find tide by ID and include associated CoastCode and Location data
        const item = await Tide.findByPk(id, {
            include: [CoastCode, Location],
        });
        if (!item) return res.status(404).json({ error: "Tide not found" });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to create a new tide
export const createTide = async (req, res) => {
    try {
        const payload = req.body;
        // Create new tide with provided data
        const item = await Tide.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to update an existing tide
export const updateTide = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        // Update tide in database
        const [updated] = await Tide.update(payload, { where: { id } });
        if (!updated) return res.status(404).json({ error: "Tide not found" });
        // Fetch and return updated tide
        const updatedItem = await Tide.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to delete a tide
export const deleteTide = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete tide by ID
        const deleted = await Tide.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: "Tide not found" });
        // Return 204 No Content on success
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to get tides by location
export const getTidesByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        // Find all tides associated with the given location
        const items = await Tide.findAll({
            where: { location_id: locationId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

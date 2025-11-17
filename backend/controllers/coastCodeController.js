// Import CoastCode, Location, and Tide models
import { CoastCode, Location, Tide } from "../models/index.js";

// Controller function to get all coast codes
export const getAllCoastCodes = async (req, res) => {
  try {
    // Fetch all coast codes from database
    const items = await CoastCode.findAll();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get a specific coast code by ID
export const getCoastCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find coast code by ID and include associated Location and Tide data
    const item = await CoastCode.findByPk(id, {
      include: [Location, Tide],
    });
    if (!item) return res.status(404).json({ error: "CoastCode not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to create a new coast code
export const createCoastCode = async (req, res) => {
  try {
    const payload = req.body;
    // Create new coast code with provided data
    const item = await CoastCode.create(payload);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to update an existing coast code
export const updateCoastCode = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // Update coast code in database
    const [updated] = await CoastCode.update(payload, { where: { id } });
    if (!updated) return res.status(404).json({ error: "CoastCode not found" });
    // Fetch and return updated coast code
    const updatedItem = await CoastCode.findByPk(id);
    return res.json(updatedItem);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to delete a coast code
export const deleteCoastCode = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete coast code by ID
    const deleted = await CoastCode.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "CoastCode not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

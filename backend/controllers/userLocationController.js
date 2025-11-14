// Import UserLocation junction table and related models
import { UserLocation, User, Location } from "../models/index.js";

// Controller function to get all locations favorited by a user
export const getUserLocations = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find all UserLocation mappings for the given user
        const items = await UserLocation.findAll({
            where: { user_id: userId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Controller function to add a location to a user's favorites
export const addUserLocation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { location_id } = req.body;
        // Create a new UserLocation mapping
        const item = await UserLocation.create({
            user_id: userId,
            location_id,
        });
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Controller function to remove a location from a user's favorites
export const removeUserLocation = async (req, res) => {
    try {
        const { userId, locationId } = req.params;
        // Delete the UserLocation mapping
        const deleted = await UserLocation.destroy({
            where: { user_id: userId, location_id: locationId },
        });
        if (!deleted)
            return res.status(404).json({ error: "Mapping not found" });
        // Return 204 No Content on success
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

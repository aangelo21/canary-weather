import { UserLocation, User, Location } from "../models/index.js";

export const getUserLocations = async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await UserLocation.findAll({
            where: { user_id: userId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const addUserLocation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { location_id } = req.body;
        const item = await UserLocation.create({
            user_id: userId,
            location_id,
        });
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const removeUserLocation = async (req, res) => {
    try {
        const { userId, locationId } = req.params;
        const deleted = await UserLocation.destroy({
            where: { user_id: userId, location_id: locationId },
        });
        if (!deleted)
            return res.status(404).json({ error: "Mapping not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

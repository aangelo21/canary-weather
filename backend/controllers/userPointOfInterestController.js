
import { UserPointOfInterest, PointOfInterest } from '../models/index.js';


export const getUserPointsOfInterest = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const items = await UserPointOfInterest.findAll({
            where: { user_id: userId },
        });
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const addUserPointOfInterest = async (req, res) => {
    try {
        const { userId } = req.params;
        const { point_of_interest_id } = req.body;
        
        const item = await UserPointOfInterest.create({
            user_id: userId,
            point_of_interest_id,
        });
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


export const removeUserPointOfInterest = async (req, res) => {
    try {
        const { userId, poiId } = req.params;
        
        const deleted = await UserPointOfInterest.destroy({
            where: { user_id: userId, point_of_interest_id: poiId },
        });
        if (!deleted)
            return res.status(404).json({ error: 'Mapping not found' });
        
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

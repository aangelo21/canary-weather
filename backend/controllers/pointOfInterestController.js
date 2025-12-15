import {
    getAllVisiblePois,
    getPersonalPois,
    getPoiById,
} from '../services/poi/poiFilterService.js';
import {
    createPoi,
    updatePoi,
    deletePoi,
} from '../services/poi/poiManagementService.js';

export const getAllPointsOfInterest = async (req, res) => {
    try {
        const items = await getAllVisiblePois(req.user);
        return res.json(items);
    } catch (err) {
        console.error('Error in getAllPointsOfInterest:', err);
        return res.status(500).json({ error: err.message });
    }
};

export const getPersonalPointsOfInterest = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const userPois = await getPersonalPois(userId);
        return res.json(userPois);
    } catch (err) {
        console.error('Error in getPersonalPointsOfInterest:', err);
        const statusCode =
            err.message === 'Authentication required' ? 401 : 500;
        return res.status(statusCode).json({ error: err.message });
    }
};

export const getPointOfInterestById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getPoiById(id);
        return res.json(item);
    } catch (err) {
        console.error('Error in getPointOfInterestById:', err);
        const statusCode =
            err.message === 'PointOfInterest not found' ? 404 : 500;
        return res.status(statusCode).json({ error: err.message });
    }
};

export const createPointOfInterest = async (req, res) => {
    try {
        const userId = req.user.id;
        const item = await createPoi(req.body, userId);
        return res.status(201).json(item);
    } catch (err) {
        console.error('Error in createPointOfInterest:', err);
        return res.status(400).json({ error: err.message });
    }
};

export const updatePointOfInterest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;
        const updatedItem = await updatePoi(id, req.body, req.file, userId);
        return res.json(updatedItem);
    } catch (err) {
        console.error('Error in updatePointOfInterest:', err);
        const statusCode =
            err.message === 'PointOfInterest not found' ? 404 : 400;
        return res.status(statusCode).json({ error: err.message });
    }
};

export const deletePointOfInterest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await deletePoi(id, userId);
        return res.status(204).send();
    } catch (err) {
        console.error('Error in deletePointOfInterest:', err);
        const statusCode =
            err.message === 'PointOfInterest not found' ? 404 : 500;
        return res.status(statusCode).json({ error: err.message });
    }
};

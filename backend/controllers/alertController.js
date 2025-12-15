import { Alert } from '../models/index.js';
import { fetchAndStoreWarnings } from '../services/meteoalarmService.js';

export const getAllAlerts = async (req, res) => {
    try {
        const items = await Alert.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getAlertById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Alert.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Alert not found' });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const createAlert = async (req, res) => {
    try {
        const payload = req.body;
        const item = await Alert.create(payload);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const updateAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const [updated] = await Alert.update(payload, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Alert not found' });
        const updatedItem = await Alert.findByPk(id);
        return res.json(updatedItem);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Alert.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: 'Alert not found' });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const fetchWarnings = async (req, res) => {
    try {
        const newAlerts = await fetchAndStoreWarnings();
        return res.json({
            message: 'Warnings fetched and stored successfully',
            newAlerts: newAlerts.length,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

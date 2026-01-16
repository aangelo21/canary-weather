import {
    getAllForecasts,
    getForecastById,
    createForecast,
    updateForecast,
    deleteForecast,
    getForecastsByPoiId,
} from '../services/forecast/forecastService.js';

export const getAllForecastsHandler = async (req, res) => {
    try {
        const items = await getAllForecasts();
        return res.json(items);
    } catch (err) {
        console.error('Error in getAllForecasts:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getForecastByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getForecastById(id);
        return res.json(item);
    } catch (err) {
        console.error(`Error in getForecastById for id ${req.params.id}:`, err);
        return res
            .status(404)
            .json({ error: err.message || 'Forecast not found' });
    }
};

export const createForecastHandler = async (req, res) => {
    try {
        const item = await createForecast(req.body);
        return res.status(201).json(item);
    } catch (err) {
        console.error('Error in createForecast:', err);
        return res.status(400).json({ error: err.message });
    }
};

export const updateForecastHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await updateForecast(id, req.body);
        return res.json(updatedItem);
    } catch (err) {
        console.error(`Error in updateForecast for id ${req.params.id}:`, err);
        const statusCode = err.message === 'Forecast not found' ? 404 : 400;
        return res.status(statusCode).json({ error: err.message });
    }
};

export const deleteForecastHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteForecast(id);
        return res.status(204).send();
    } catch (err) {
        console.error(`Error in deleteForecast for id ${req.params.id}:`, err);
        const statusCode = err.message === 'Forecast not found' ? 404 : 500;
        return res
            .status(statusCode)
            .json({ error: err.message || 'Internal Server Error' });
    }
};

export const getForecastsByPOIHandler = async (req, res) => {
    try {
        const { poiId } = req.params;
        const items = await getForecastsByPoiId(poiId);
        return res.json(items);
    } catch (err) {
        console.error(
            `Error in getForecastsByPOI for poiId ${req.params.poiId}:`,
            err,
        );
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

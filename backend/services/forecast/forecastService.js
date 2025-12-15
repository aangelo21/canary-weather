import { Forecast, PointOfInterest } from '../../models/index.js';

export const getAllForecasts = async () => {
    return await Forecast.findAll({
        raw: true,
        nest: true,
    });
};

export const getForecastById = async (forecastId) => {
    const forecast = await Forecast.findByPk(forecastId, {
        include: [PointOfInterest],
    });

    if (!forecast) {
        throw new Error('Forecast not found');
    }

    return forecast;
};

export const createForecast = async (forecastData) => {
    return await Forecast.create(forecastData);
};

export const updateForecast = async (forecastId, updateData) => {
    const [updated] = await Forecast.update(updateData, {
        where: { id: forecastId },
    });

    if (!updated) {
        throw new Error('Forecast not found');
    }

    return await Forecast.findByPk(forecastId);
};

export const deleteForecast = async (forecastId) => {
    const deleted = await Forecast.destroy({ where: { id: forecastId } });

    if (!deleted) {
        throw new Error('Forecast not found');
    }

    return { success: true };
};

export const getForecastsByPoiId = async (poiId) => {
    return await Forecast.findAll({
        where: { poi_id: poiId },
        raw: true,
        nest: true,
    });
};

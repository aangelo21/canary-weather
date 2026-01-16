import {
    PointOfInterest,
    UserLocation,
    Location,
    UserPointOfInterest,
} from '../../models/index.js';
import { Op } from 'sequelize';

export const getAllVisiblePois = async (user) => {
    let whereClause;

    if (user && user.is_admin) {
        whereClause = {
            type: { [Op.in]: ['global', 'local'] },
        };
    } else {
        const orConditions = [{ type: 'global' }];

        if (user) {
            const userLocations = await UserLocation.findAll({
                where: { user_id: user.id },
                include: [Location],
            });

            const locationNames = userLocations
                .map((ul) => (ul.Location ? ul.Location.name : null))
                .filter((name) => name !== null);

            if (locationNames.length > 0) {
                const poiNames = locationNames.map(
                    (name) => `Municipio: ${name}`,
                );
                orConditions.push({
                    type: 'local',
                    name: { [Op.in]: poiNames },
                });
            }
        }

        whereClause = {
            [Op.or]: orConditions,
        };
    }

    return await PointOfInterest.findAll({
        where: whereClause,
    });
};

export const getPersonalPois = async (userId) => {
    if (!userId) {
        throw new Error('Authentication required');
    }

    return await PointOfInterest.findAll({
        where: {
            type: {
                [Op.in]: ['personal', 'local'],
            },
        },
        include: [
            {
                model: UserPointOfInterest,
                where: { user_id: userId },
                required: true,
                attributes: [],
            },
        ],
        group: ['PointOfInterest.id'],
    });
};

export const getPoiById = async (poiId) => {
    const poi = await PointOfInterest.findByPk(poiId);

    if (!poi) {
        throw new Error('PointOfInterest not found');
    }

    return poi;
};

import {
    PointOfInterest,
    UserPointOfInterest,
    UserLocation,
    Location,
    User,
} from '../../models/index.js';
import {
    sendPoiCreatedEmail,
    sendPoiUpdatedEmail,
    sendPoiDeletedEmail,
} from '../emailService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPoi = async (poiData, userId) => {
    const payload = { ...poiData };

    if (!payload.type) {
        payload.type = payload.is_global ? 'global' : 'personal';
    }

    const item = await PointOfInterest.create(payload);

    await UserPointOfInterest.create({
        user_id: userId,
        point_of_interest_id: item.id,
        favorited_at: new Date(),
    });

    const user = await User.findByPk(userId);
    const userEmail = user?.email;

    if (userEmail && user?.username) {
        sendPoiCreatedEmail(userEmail, user.username, item.name);
    }

    return item;
};

export const updatePoi = async (poiId, updateData, uploadedFile, userId) => {
    const currentPoi = await PointOfInterest.findByPk(poiId);

    if (!currentPoi) {
        throw new Error('PointOfInterest not found');
    }

    const payload = { ...updateData };

    if (payload.latitude !== undefined && payload.latitude !== '') {
        payload.latitude = parseFloat(payload.latitude);
    } else if (payload.latitude === '') {
        payload.latitude = null;
    }

    if (payload.longitude !== undefined && payload.longitude !== '') {
        payload.longitude = parseFloat(payload.longitude);
    } else if (payload.longitude === '') {
        payload.longitude = null;
    }

    if (payload.is_global !== undefined) {
        payload.is_global =
            payload.is_global === true || payload.is_global === 'true';
    }

    if (uploadedFile) {
        if (
            currentPoi.image_url &&
            currentPoi.image_url.startsWith('/uploads/')
        ) {
            const relativePath = currentPoi.image_url.startsWith('/')
                ? currentPoi.image_url.substring(1)
                : currentPoi.image_url;
            const oldPath = path.join(__dirname, '../..', relativePath);
            try {
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            } catch (err) {
                console.error('Failed to delete old POI image:', err);
            }
        }
        payload.image_url = `/uploads/poi-images/${uploadedFile.filename}`;
    }

    await currentPoi.update(payload);
    const updatedItem = await PointOfInterest.findByPk(poiId);

    if (userId) {
        const user = await User.findByPk(userId);
        const userEmail = user?.email;

        if (userEmail && user?.username) {
            sendPoiUpdatedEmail(userEmail, user.username, updatedItem.name);
        }
    }

    return updatedItem;
};

export const deletePoi = async (poiId, userId) => {
    const poi = await PointOfInterest.findByPk(poiId);

    if (!poi) {
        throw new Error('PointOfInterest not found');
    }

    if (poi.type === 'local') {
        await UserPointOfInterest.destroy({
            where: {
                user_id: userId,
                point_of_interest_id: poiId,
            },
        });

        if (poi.name.startsWith('Municipio: ')) {
            const locationName = poi.name.replace('Municipio: ', '');
            const location = await Location.findOne({
                where: { name: locationName },
            });

            if (location) {
                await UserLocation.destroy({
                    where: {
                        user_id: userId,
                        location_id: location.id,
                    },
                });
            }
        }

        return { deleted: true, type: 'local' };
    }

    await PointOfInterest.destroy({ where: { id: poiId } });

    if (userId) {
        const user = await User.findByPk(userId);
        const userEmail = user?.email;

        if (userEmail && user?.username) {
            sendPoiDeletedEmail(userEmail, user.username, poi.name);
        }
    }

    return { deleted: true, type: poi.type };
};

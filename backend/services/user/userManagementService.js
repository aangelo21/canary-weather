import {
    User,
    Location,
    UserLocation,
    UserPointOfInterest,
    PointOfInterest,
    UserProfile,
} from '../../models/index.js';
import { LdapService } from '../ldapService.js';
import { sendWelcomeEmail, sendContactEmail } from '../emailService.js';
import { generateAccessToken } from '../auth/tokenService.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUserProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        include: [{ model: UserLocation, include: [Location] }],
    });

    if (!user) {
        throw new Error('User not found');
    }

    const locations = user.UserLocations
        ? user.UserLocations.map((ul) => ul.Location)
        : [];
    const userProfileData = await UserProfile.findByPk(userId);

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
        is_admin: user.is_admin,
        Locations: locations,
    };
};

export const registerUser = async (userData) => {
    const { email, username, password, location_ids } = userData;

    if (!email || !username || !password) {
        throw new Error('Faltan campos obligatorios');
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        throw new Error('El email ya está registrado');
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        throw new Error('El usuario ya existe');
    }

    const ldapUserExists = await LdapService.userExists(username);
    if (ldapUserExists) {
        throw new Error('El usuario ya existe en LDAP');
    }

    const ldapResult = await LdapService.createUser(username, email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        ldap_id: ldapResult.ldapId,
        is_admin: false,
    });

    sendWelcomeEmail(email, username);

    if (location_ids && Array.isArray(location_ids)) {
        await addUserLocations(user.id, location_ids);
    }

    const token = generateAccessToken(user);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_picture_url: user.profile_picture_url,
            is_admin: user.is_admin,
        },
        token,
    };
};

export const updateUserProfile = async (userId, updateData, uploadedFile) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error('User not found');
    }

    if (
        uploadedFile ||
        updateData.profile_picture_url === '' ||
        updateData.profile_picture_url === null
    ) {
        if (
            user.profile_picture_url &&
            user.profile_picture_url.startsWith('/uploads/')
        ) {
            const relativePath = user.profile_picture_url.startsWith('/')
                ? user.profile_picture_url.substring(1)
                : user.profile_picture_url;
            const oldPath = path.join(__dirname, '../..', relativePath);
            try {
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            } catch (err) {
                console.error('Failed to delete old profile picture:', err);
            }
        }
    }

    if (uploadedFile) {
        user.profile_picture_url = `/uploads/profile-pictures/${uploadedFile.filename}`;
    } else if (
        updateData.profile_picture_url === '' ||
        updateData.profile_picture_url === null
    ) {
        user.profile_picture_url = null;
    } else if (updateData.profile_picture_url) {
        user.profile_picture_url = updateData.profile_picture_url;
    }

    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.save();

    if (updateData.location_ids && Array.isArray(updateData.location_ids)) {
        await UserLocation.destroy({ where: { user_id: userId } });

        const localPois = await PointOfInterest.findAll({
            where: { type: 'local' },
        });
        const localPoiIds = localPois.map((poi) => poi.id);
        await UserPointOfInterest.destroy({
            where: {
                user_id: userId,
                point_of_interest_id: localPoiIds,
            },
        });

        await addUserLocations(userId, updateData.location_ids);
    }

    return await getUserProfile(userId);
};

export const getMunicipalities = async () => {
    return await Location.findAll({
        where: {
            latitude: { [Op.ne]: null },
            longitude: { [Op.ne]: null },
        },
        order: [['name', 'ASC']],
    });
};

export const sendContactMessage = async (email, name, subject, message) => {
    if (!email) {
        throw new Error('User email not found. Please login or provide email.');
    }

    const result = await sendContactEmail(email, name, subject, message);

    if (!result.success) {
        throw new Error('Failed to send message');
    }

    return { message: 'Message sent successfully' };
};

const addUserLocations = async (userId, locationIds) => {
    for (const location_id of locationIds) {
        await UserLocation.create({
            user_id: userId,
            location_id: location_id,
            selected_at: new Date(),
        });

        const location = await Location.findByPk(location_id);
        if (location) {
            const poi = await PointOfInterest.findOne({
                where: {
                    name: `Municipio: ${location.name}`,
                    type: 'local',
                },
            });
            if (poi) {
                await UserPointOfInterest.create({
                    user_id: userId,
                    point_of_interest_id: poi.id,
                    favorited_at: new Date(),
                });
            }
        }
    }
};

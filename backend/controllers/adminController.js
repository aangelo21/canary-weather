import {
    PointOfInterest,
    Alert,
    Location,
    UserLocation,
    User,
} from '../models/index.js';
import { LdapService } from '../services/ldapService.js';
import { Op } from 'sequelize';
import sequelize from './dbController.js';

export const getDashboard = async (req, res) => {
    try {
        const { search, type, userSearch } = req.query;
        const where = {};

        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        if (type && type !== '') {
            where.type = type;
        }

        const poisCount = await PointOfInterest.count();
        const alertsCount = await Alert.count();

        const pois = await PointOfInterest.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });

        const userWhere = {};
        if (userSearch) {
            userWhere[Op.or] = [
                { username: { [Op.like]: `%${userSearch}%` } },
                { email: { [Op.like]: `%${userSearch}%` } },
            ];
        }
        const users = await User.findAll({
            where: userWhere,
            order: [['createdAt', 'DESC']],
        });
        const usersCount = await User.count();

        const poiByCategory = await PointOfInterest.findAll({
            attributes: [
                'type',
                [
                    sequelize.fn('COUNT', sequelize.col('PointOfInterest.id')),
                    'count',
                ],
            ],
            group: ['type'],
        });

        const usersPerLocation = await UserLocation.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('user_id')), 'count'],
            ],
            include: [
                {
                    model: Location,
                    attributes: ['name'],
                },
            ],
            group: ['location_id', 'Location.id', 'Location.name'],
        });

        const usersPerDay = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
        });

        const poisPerDay = await PointOfInterest.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        return res.render('dashboard', {
            usersCount,
            poisCount,
            alertsCount,
            frontendUrl,
            pois,
            users,
            filters: { search, type, userSearch },
            stats: {
                poiByCategory,
                usersPerLocation,
                usersPerDay,
                poisPerDay,
            },
        });
    } catch (err) {
        return res.status(500).send('Error loading dashboard: ' + err.message);
    }
};

export const createGlobalPOI = async (req, res) => {
    try {
        const { name, latitude, longitude, description, token } = req.body;

        await PointOfInterest.create({
            name,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description: description || null,
            is_global: true,
            type: 'global',
        });

        return res.redirect(`/admin?token=${token}`);
    } catch (err) {
        return res.status(500).send('Error creating POI: ' + err.message);
    }
};

export const updatePOI = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, latitude, longitude, type, description, token } =
            req.body;

        await PointOfInterest.update(
            {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                description: description || null,
                is_global: type === 'global',
                type: type,
            },
            {
                where: { id },
            },
        );

        return res.redirect(`/admin?token=${token}`);
    } catch (err) {
        return res.status(500).send('Error updating POI: ' + err.message);
    }
};

export const deletePOI = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body;

        await PointOfInterest.destroy({
            where: { id },
        });

        return res.redirect(`/admin?token=${token}`);
    } catch (err) {
        return res.status(500).send('Error deleting POI: ' + err.message);
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, is_admin } = req.body;

        await LdapService.createUser(username, email, password);

        await User.create({
            username,
            email,
            is_admin: is_admin === 'on',
        });

        return res.redirect('/admin');
    } catch (err) {
        return res.status(500).send('Error creating user: ' + err.message);
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, is_admin } = req.body;

        const user = await User.findByPk(id);
        if (user) {
            user.email = email;
            user.is_admin = is_admin === 'on';
            await user.save();
        }

        return res.redirect('/admin');
    } catch (err) {
        return res.status(500).send('Error updating user: ' + err.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (user) {
            await LdapService.deleteUser(user.username);
            await user.destroy();
        }

        return res.redirect('/admin');
    } catch (err) {
        return res.status(500).send('Error deleting user: ' + err.message);
    }
};

import { User, PointOfInterest, Alert } from "../models/index.js";
import { Op } from "sequelize";

// Controller for admin-related endpoints

// Get admin dashboard
export const getDashboard = async (req, res) => {
  try {
    const { search, type, userSearch } = req.query;
    const where = {};
    const userWhere = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (type && type !== "") {
      where.type = type;
    }

    if (userSearch) {
      userWhere[Op.or] = [
        { username: { [Op.like]: `%${userSearch}%` } },
        { email: { [Op.like]: `%${userSearch}%` } }
      ];
    }

    const usersCount = await User.count();
    const poisCount = await PointOfInterest.count();
    const alertsCount = await Alert.count();

    const pois = await PointOfInterest.findAll({
      where,
      include: [
        {
          model: User,
          through: { attributes: [] }, // Hide join table attributes
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const users = await User.findAll({
      where: userWhere,
      order: [["createdAt", "DESC"]],
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    return res.render("dashboard", {
      usersCount,
      poisCount,
      alertsCount,
      frontendUrl,
      pois,
      users,
      filters: { search, type, userSearch },
    });
  } catch (err) {
    return res.status(500).send("Error loading dashboard: " + err.message);
  }
};

// Create Global POI
export const createGlobalPOI = async (req, res) => {
  try {
    const { name, latitude, longitude, token } = req.body;

    await PointOfInterest.create({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      is_global: true,
      type: 'global'
    });
    
    return res.redirect(`/admin?token=${token}`);
  } catch (err) {
    return res.status(500).send("Error creating POI: " + err.message);
  }
};

// Update POI
export const updatePOI = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, type, token } = req.body;

    await PointOfInterest.update({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      is_global: type === 'global',
      type: type
    }, {
      where: { id }
    });

    return res.redirect(`/admin?token=${token}`);
  } catch (err) {
    return res.status(500).send("Error updating POI: " + err.message);
  }
};

// Delete POI
export const deletePOI = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    await PointOfInterest.destroy({
      where: { id }
    });

    return res.redirect(`/admin?token=${token}`);
  } catch (err) {
    return res.status(500).send("Error deleting POI: " + err.message);
  }
};

// User Management
export const createUser = async (req, res) => {
  try {
    const { username, email, password, is_admin } = req.body;
    await User.create({
      username,
      email,
      password,
      is_admin: is_admin === 'on'
    });
    return res.redirect('/admin');
  } catch (err) {
    return res.status(500).send("Error creating user: " + err.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, is_admin } = req.body;
    
    const updateData = {
      username,
      email,
      is_admin: is_admin === 'on'
    };

    await User.update(updateData, { where: { id } });
    return res.redirect('/admin');
  } catch (err) {
    return res.status(500).send("Error updating user: " + err.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.redirect('/admin');
  } catch (err) {
    return res.status(500).send("Error deleting user: " + err.message);
  }
};
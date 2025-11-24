import { User, PointOfInterest, Alert } from "../models/index.js";
import { Op } from "sequelize";

// Controller for admin-related endpoints

// Get admin dashboard
export const getDashboard = async (req, res) => {
  try {
    const { search, type } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (type && type !== "") {
      where.type = type;
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

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    return res.render("dashboard", {
      usersCount,
      poisCount,
      alertsCount,
      frontendUrl,
      pois,
      filters: { search, type },
      token: req.token,
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
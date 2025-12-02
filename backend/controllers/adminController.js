import { PointOfInterest, Alert, Location, UserLocation } from "../models/index.js";
import { LdapService } from "../services/ldapService.js";
import { Op } from "sequelize";
import sequelize from "./dbController.js";

// Note: User model usage is removed/minimized as users are now in LDAP.
// Dashboard stats for users will be unavailable or require LDAP search implementation.

export const getDashboard = async (req, res) => {
  try {
    const { search, type, userSearch } = req.query;
    const where = {};
    
    // Apply search filter for POIs if provided
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    // Apply type filter for POIs if provided
    if (type && type !== "") {
      where.type = type;
    }

    // Fetch basic counts
    const usersCount = 0; // LDAP count not implemented
    const poisCount = await PointOfInterest.count();
    const alertsCount = await Alert.count();

    // Fetch filtered POIs
    const pois = await PointOfInterest.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    // Fetch filtered Users - Not implemented for LDAP in dashboard yet
    const users = []; 

    // --- Dashboard Statistics ---
    
    // 1. POI count by category
    const poiByCategory = await PointOfInterest.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('PointOfInterest.id')), 'count']],
      group: ['type']
    });

    // 2. Users count per selected location
    const usersPerLocation = await UserLocation.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'count']
      ],
      include: [{
        model: Location,
        attributes: ['name']
      }],
      group: ['location_id', 'Location.id', 'Location.name']
    });

    // 3. Users created per day - Not available
    const usersPerDay = [];

    // 4. POIs created per day
    const poisPerDay = await PointOfInterest.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
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
      stats: {
        poiByCategory,
        usersPerLocation,
        usersPerDay,
        poisPerDay
      }
    });
  } catch (err) {
    return res.status(500).send("Error loading dashboard: " + err.message);
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
      type: 'global'
    });
    
    return res.redirect(`/admin?token=${token}`);
  } catch (err) {
    return res.status(500).send("Error creating POI: " + err.message);
  }
};

export const updatePOI = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, type, description, token } = req.body;

    await PointOfInterest.update({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description: description || null,
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

export const createUser = async (req, res) => {
  try {
    const { username, email, password, is_admin } = req.body;
    
    // Create in LDAP
    await LdapService.createUser(username, email, password);
    
    // Note: is_admin handling in LDAP (adding to admins group) is not implemented in createUser yet.
    // It defaults to 'normals' group.
    
    return res.redirect('/admin');
  } catch (err) {
    return res.status(500).send("Error creating user: " + err.message);
  }
};

export const updateUser = async (req, res) => {
  // Not implemented for LDAP
  return res.status(501).send("Not implemented for LDAP");
};

export const deleteUser = async (req, res) => {
  // Not implemented for LDAP
  return res.status(501).send("Not implemented for LDAP");
};

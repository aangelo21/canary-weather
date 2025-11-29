import { User, PointOfInterest, Alert, Location, UserLocation } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "./dbController.js";

/**
 * Admin Controller
 * 
 * Handles all administrative operations including dashboard statistics,
 * user management, and content moderation.
 */

/**
 * Retrieves the admin dashboard data.
 * 
 * This function aggregates various statistics for the admin dashboard, including:
 * - Total counts of Users, Points of Interest (POIs), and Alerts.
 * - Filtered lists of POIs and Users based on search queries.
 * - Detailed statistics:
 *   1. POI distribution by category (Global, Local, Personal).
 *   2. User distribution by their selected locations.
 *   3. User registration trends over time (daily).
 *   4. POI creation trends over time (daily).
 * 
 * The data is rendered server-side using the 'dashboard' view template.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - Query parameters for filtering.
 * @param {string} [req.query.search] - Search term for POI names.
 * @param {string} [req.query.type] - Filter for POI type.
 * @param {string} [req.query.userSearch] - Search term for Usernames or Emails.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Renders the dashboard view.
 */
export const getDashboard = async (req, res) => {
  try {
    const { search, type, userSearch } = req.query;
    const where = {};
    const userWhere = {};

    // Apply search filter for POIs if provided
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    // Apply type filter for POIs if provided
    if (type && type !== "") {
      where.type = type;
    }

    // Apply search filter for Users if provided (matches username or email)
    if (userSearch) {
      userWhere[Op.or] = [
        { username: { [Op.like]: `%${userSearch}%` } },
        { email: { [Op.like]: `%${userSearch}%` } }
      ];
    }

    // Fetch basic counts
    const usersCount = await User.count();
    const poisCount = await PointOfInterest.count();
    const alertsCount = await Alert.count();

    // Fetch filtered POIs with associated Users
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

    // Fetch filtered Users
    const users = await User.findAll({
      where: userWhere,
      order: [["createdAt", "DESC"]],
    });

    // --- Dashboard Statistics ---
    
    // 1. POI count by category (e.g., how many 'global' vs 'local' POIs)
    const poiByCategory = await PointOfInterest.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('PointOfInterest.id')), 'count']],
      group: ['type']
    });

    // 2. Users count per selected location (e.g., how many users are in 'Tenerife')
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

    // 3. Users created per day (for growth charts)
    const usersPerDay = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // 4. POIs created per day (for activity charts)
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

/**
 * Creates a new Global Point of Interest (POI).
 * 
 * Global POIs are visible to all users and are typically managed by administrators.
 * This function handles the form submission from the admin dashboard.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The form data.
 * @param {string} req.body.name - The name of the POI.
 * @param {number|string} req.body.latitude - The latitude coordinate.
 * @param {number|string} req.body.longitude - The longitude coordinate.
 * @param {string} [req.body.description] - A description of the POI.
 * @param {string} req.body.token - The authentication token to maintain session state.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Redirects back to the admin dashboard.
 */
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

/**
 * Updates an existing Point of Interest (POI).
 * 
 * Allows administrators to modify the details of any POI, including its
 * location, type (Global/Local/Personal), and description.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the POI to update.
 * @param {Object} req.body - The form data.
 * @param {string} req.body.name - The new name.
 * @param {number|string} req.body.latitude - The new latitude.
 * @param {number|string} req.body.longitude - The new longitude.
 * @param {string} req.body.type - The new type ('global', 'local', 'personal').
 * @param {string} [req.body.description] - The new description.
 * @param {string} req.body.token - The authentication token.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Redirects back to the admin dashboard.
 */
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

/**
 * Deletes a Point of Interest (POI).
 * 
 * Permanently removes a POI from the database.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the POI to delete.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.token - The authentication token.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Redirects back to the admin dashboard.
 */
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

/**
 * Creates a new User account.
 * 
 * Allows administrators to manually create user accounts from the dashboard.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The form data.
 * @param {string} req.body.username - The username.
 * @param {string} req.body.email - The email address.
 * @param {string} req.body.password - The password (will be hashed by the model).
 * @param {string} [req.body.is_admin] - Checkbox value ('on') if the user should be an admin.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Redirects back to the admin dashboard.
 */
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

/**
 * Updates an existing User account.
 * 
 * Allows administrators to modify user details such as username, email,
 * and administrative privileges.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {Object} req.body - The form data.
 * @param {string} req.body.username - The new username.
 * @param {string} req.body.email - The new email.
 * @param {string} [req.body.is_admin] - Checkbox value ('on') if the user should be an admin.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Redirects back to the admin dashboard.
 */
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

/**
 * Deletes a User account.
 * 
 * Permanently removes a user from the database.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Redirects back to the admin dashboard.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.redirect('/admin');
  } catch (err) {
    return res.status(500).send("Error deleting user: " + err.message);
  }
};
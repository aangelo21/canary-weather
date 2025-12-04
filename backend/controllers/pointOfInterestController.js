import { PointOfInterest, UserPointOfInterest, UserLocation, Location, User } from "../models/index.js";
import { sendPoiCreatedEmail, sendPoiUpdatedEmail, sendPoiDeletedEmail } from "../services/emailService.js";
import { LdapService } from "../services/ldapService.js";
import { Op } from "sequelize";
import sequelize from "../controllers/dbController.js";

/**
 * Point of Interest (POI) Controller
 * 
 * Manages the retrieval, creation, and modification of Points of Interest.
 * Handles complex logic for filtering POIs based on user roles (Admin vs User)
 * and types (Global, Local, Personal).
 */

/**
 * Retrieves all visible Points of Interest for the current user context.
 * 
 * - **Admins**: Can see all 'global' and 'local' POIs.
 * - **Authenticated Users**: See 'global' POIs + 'local' POIs relevant to their selected location (municipality).
 * - **Guests**: See only 'global' POIs.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object (if any).
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the filtered list of POIs.
 */
export const getAllPointsOfInterest = async (req, res) => {
  try {
    let whereClause;

    // Check if user is authenticated and is admin
    if (req.user && req.user.is_admin) {
      // Admins see all global and local POIs
      whereClause = {
        type: { [Op.in]: ['global', 'local'] }
      };
    } else {
      // Regular users or guests
      const orConditions = [
        { type: 'global' } // Always show global POIs
      ];

      if (req.user) {
        const userLocation = await UserLocation.findOne({
          where: { user_id: req.user.id },
          include: [Location]
        });

        if (userLocation && userLocation.Location) {
          orConditions.push({
            type: 'local',
            name: `Municipio: ${userLocation.Location.name}`
          });
        }
      }

      whereClause = {
        [Op.or]: orConditions
      };
    }

    const items = await PointOfInterest.findAll({
      where: whereClause
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves "Personal" Points of Interest for the authenticated user.
 * 
 * Fetches POIs that the user has explicitly saved or created as 'personal'.
 * Also includes 'local' POIs that are associated with the user.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the user's personal POIs.
 */
export const getPersonalPointsOfInterest = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPois = await PointOfInterest.findAll({
      where: { 
        type: {
          [Op.in]: ['personal', 'local']
        }
      },
      include: [{
        model: UserPointOfInterest,
        where: { user_id: userId },
        required: true,
        attributes: [] // Don't include the junction table data in the result
      }],
      // Ensure we don't get duplicates if there are multiple associations (though there shouldn't be)
      group: ['PointOfInterest.id']
    });

    return res.json(userPois);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a specific POI by ID.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the POI.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the POI details or a 404 error.
 */
export const getPointOfInterestById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PointOfInterest.findByPk(id);
    if (!item)
      return res.status(404).json({ error: "PointOfInterest not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a new Point of Interest.
 * 
 * Automatically assigns the type ('global' or 'personal') if not provided.
 * If the user is authenticated, it also creates an association in `UserPointOfInterest`.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The POI data.
 * @param {Object} req.user - The authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the created POI.
 */
export const createPointOfInterest = async (req, res) => {
  try {
    const payload = req.body;
    
    if (!payload.type) {
      payload.type = payload.is_global ? 'global' : 'personal';
    }
    
    const item = await PointOfInterest.create(payload);


    const userId = req.user.id;
    await UserPointOfInterest.create({
      user_id: userId,
      point_of_interest_id: item.id,
      favorited_at: new Date()
    });

    // Send email notification
    // We need the user's email. Since req.user might not have it (depending on how it was populated),
    // we might need to fetch it or assume it's in req.user if we updated the auth middleware.
    // Assuming req.user has email or we can fetch it.
    let userEmail = req.user.email;
    if (!userEmail) {
        // Try to fetch from DB
        const user = await User.findByPk(userId);
        if (user) userEmail = user.email;
    }

    if (userEmail) {
        sendPoiCreatedEmail(userEmail, req.user.username, item.name);
    }

    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Updates an existing Point of Interest.
 * 
 * Handles updates to POI details, including file uploads for images.
 * Parses latitude/longitude and boolean flags correctly.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the POI to update.
 * @param {Object} req.body - The updated data.
 * @param {Object} [req.file] - The uploaded image file (optional).
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response containing the updated POI.
 */
export const updatePointOfInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.latitude !== undefined && payload.latitude !== "") {
      payload.latitude = parseFloat(payload.latitude);
    } else if (payload.latitude === "") {
      payload.latitude = null;
    }

    if (payload.longitude !== undefined && payload.longitude !== "") {
      payload.longitude = parseFloat(payload.longitude);
    } else if (payload.longitude === "") {
      payload.longitude = null;
    }

    if (payload.is_global !== undefined) {
      payload.is_global =
        payload.is_global === true || payload.is_global === "true";
    }

    if (req.file) {
      payload.image_url = `/uploads/poi-images/${req.file.filename}`;
    }

    const [updated] = await PointOfInterest.update(payload, {
      where: { id },
    });
    if (!updated)
      return res.status(404).json({ error: "PointOfInterest not found" });
    const updatedItem = await PointOfInterest.findByPk(id);

    // Send email notification
    if (req.user) {
        let userEmail = req.user.email;
        if (!userEmail) {
            const user = await User.findByPk(req.user.id);
            if (user) userEmail = user.email;
        }

        if (userEmail) {
            sendPoiUpdatedEmail(userEmail, req.user.username, updatedItem.name);
        }
    }

    return res.json(updatedItem);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletes a Point of Interest.
 * 
 * - If the POI is 'local', it only removes the user's association (unfavorites it)
 *   and potentially the associated UserLocation, but keeps the POI itself.
 * - If the POI is 'personal' or 'global' (and user has permission), it deletes the POI record.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.id - The ID of the POI to delete.
 * @param {Object} req.user - The authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} 204 No Content response on success.
 */
export const deletePointOfInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const poi = await PointOfInterest.findByPk(id);
    if (!poi)
      return res.status(404).json({ error: "PointOfInterest not found" });

    if (poi.type === 'local') {
      // For local POIs, we only remove the user's association
      await UserPointOfInterest.destroy({
        where: {
          user_id: userId,
          point_of_interest_id: id
        }
      });

      // Also remove the UserLocation association
      if (poi.name.startsWith('Municipio: ')) {
        const locationName = poi.name.replace('Municipio: ', '');
        const location = await Location.findOne({ where: { name: locationName } });
        
        if (location) {
          await UserLocation.destroy({
            where: {
              user_id: userId,
              location_id: location.id
            }
          });
        }
      }
      
      return res.status(204).send();
    }

    const deleted = await PointOfInterest.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ error: "PointOfInterest not found" });

    // Send email notification
    // Send email notification
    if (req.user) {
        let userEmail = req.user.email;
        if (!userEmail) {
            const user = await User.findByPk(req.user.id);
            if (user) userEmail = user.email;
        }

        if (userEmail) {
            sendPoiDeletedEmail(userEmail, req.user.username, poi.name);
        }
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

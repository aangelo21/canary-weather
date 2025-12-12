import { UserLocation, User, Location, UserPointOfInterest, PointOfInterest } from "../models/index.js";

/**
 * Retrieves all locations selected by a specific user.
 * 
 * Returns a list of UserLocation records, including the associated Location details.
 * Ordered by selection date in descending order.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the list of user locations.
 */
export const getUserLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await UserLocation.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Location,
          attributes: ["id", "name", "latitude", "longitude", "aemet_code"],
        },
      ],
      order: [["selected_at", "DESC"]],
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Sets a location as the user's selected location.
 * 
 * Ensures a user has only one selected location at a time by removing existing ones.
 * Also manages the synchronization with 'local' type Points of Interest (POIs).
 * When a location is selected, the corresponding local POI is automatically favorited.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.location_id - The ID of the location to select.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the created UserLocation record.
 */
export const addUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { location_id } = req.body;
    
    // Remove any existing location for this user to ensure only one is selected
    await UserLocation.destroy({
      where: { user_id: userId }
    });

    // Remove existing UserPointOfInterest for local POIs
    const localPois = await PointOfInterest.findAll({
      where: { type: 'local' }
    });
    const localPoiIds = localPois.map(poi => poi.id);
    await UserPointOfInterest.destroy({
      where: { 
        user_id: userId,
        point_of_interest_id: localPoiIds
      }
    });

    const item = await UserLocation.create({
      user_id: userId,
      location_id,
      selected_at: new Date(),
    });
    
    // Find the location to get its name
    const location = await Location.findByPk(location_id);
    if (location) {
      // Find the corresponding POI
      const poi = await PointOfInterest.findOne({
        where: { 
          name: `Municipio: ${location.name}`,
          type: 'local'
        }
      });
      if (poi) {
        // Add to UserPointOfInterest
        await UserPointOfInterest.create({
          user_id: userId,
          point_of_interest_id: poi.id,
          favorited_at: new Date(),
        });
      }
    }
    
    const result = await UserLocation.findByPk(item.id, {
      include: [
        {
          model: Location,
          attributes: ["id", "name", "latitude", "longitude", "aemet_code"],
        },
      ],
    });
    
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Removes a location from a user's selection.
 * 
 * Deletes the UserLocation record and also removes the corresponding
 * local Point of Interest from the user's favorites.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {string} req.params.locationId - The ID of the location to remove.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} 204 No Content response on success.
 */
export const removeUserLocation = async (req, res) => {
  try {
    const { userId, locationId } = req.params;
    
    // Find the location to get its name
    const location = await Location.findByPk(locationId);
    
    // Delete the UserLocation mapping
    const deleted = await UserLocation.destroy({
      where: { user_id: userId, location_id: locationId },
    });
    if (!deleted) return res.status(404).json({ error: "Mapping not found" });
    
    // If location found, remove the corresponding POI from UserPointOfInterest
    if (location) {
      const poi = await PointOfInterest.findOne({
        where: { 
          name: `Municipio: ${location.name}`,
          type: 'local'
        }
      });
      if (poi) {
        await UserPointOfInterest.destroy({
          where: { 
            user_id: userId,
            point_of_interest_id: poi.id
          }
        });
      }
    }
    
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

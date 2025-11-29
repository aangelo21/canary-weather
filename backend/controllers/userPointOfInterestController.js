// Import UserPointOfInterest junction table and PointOfInterest model
import { UserPointOfInterest, PointOfInterest } from "../models/index.js";

/**
 * Retrieves all Points of Interest favorited by a specific user.
 * 
 * Returns a list of UserPointOfInterest records.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the list of favorited POIs.
 */
export const getUserPointsOfInterest = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find all UserPointOfInterest mappings for the given user
    const items = await UserPointOfInterest.findAll({
      where: { user_id: userId },
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Adds a Point of Interest to a user's favorites.
 * 
 * Creates a new association between the user and the POI.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.point_of_interest_id - The ID of the POI to favorite.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the created UserPointOfInterest record.
 */
export const addUserPointOfInterest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { point_of_interest_id } = req.body;
    // Create a new UserPointOfInterest mapping
    const item = await UserPointOfInterest.create({
      user_id: userId,
      point_of_interest_id,
    });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Removes a Point of Interest from a user's favorites.
 * 
 * Deletes the association between the user and the POI.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {string} req.params.poiId - The ID of the POI to remove.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} 204 No Content response on success.
 */
export const removeUserPointOfInterest = async (req, res) => {
  try {
    const { userId, poiId } = req.params;
    // Delete the UserPointOfInterest mapping
    const deleted = await UserPointOfInterest.destroy({
      where: { user_id: userId, point_of_interest_id: poiId },
    });
    if (!deleted) return res.status(404).json({ error: "Mapping not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

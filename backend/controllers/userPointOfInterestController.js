// Import UserPointOfInterest junction table and PointOfInterest model
import { UserPointOfInterest, PointOfInterest } from "../models/index.js";

// Controller function to get all points of interest favorited by a user
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

// Controller function to add a point of interest to a user's favorites
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

// Controller function to remove a point of interest from a user's favorites
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

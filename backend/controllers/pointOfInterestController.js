// Import PointOfInterest, Location and UserPointOfInterest models
import { PointOfInterest, Location, UserPointOfInterest } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../controllers/dbController.js";

// Controller function to get all points of interest
export const getAllPointsOfInterest = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user ? req.user.id : null;

    if (userId) {
      // If user is authenticated, get all POIs that are either global or created by this user
      // First get global POIs
      const globalPois = await PointOfInterest.findAll({
        where: { is_global: true }
      });

      // Then get POIs created by this user (those with UserPointOfInterest records)
      const userCreatedPois = await PointOfInterest.findAll({
        include: [{
          model: UserPointOfInterest,
          where: { user_id: userId },
          required: true
        }]
      });

      // Combine results, removing duplicates
      const poiMap = new Map();
      globalPois.forEach(poi => poiMap.set(poi.id, poi));
      userCreatedPois.forEach(poi => poiMap.set(poi.id, poi));

      const allPois = Array.from(poiMap.values());
      return res.json(allPois);
    } else {
      // If not authenticated, only show global POIs
      const items = await PointOfInterest.findAll({
        where: { is_global: true }
      });
      return res.json(items);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get a specific point of interest by ID
export const getPointOfInterestById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find POI by ID and include associated Location data
    const item = await PointOfInterest.findByPk(id, {
      include: [Location],
    });
    if (!item)
      return res.status(404).json({ error: "PointOfInterest not found" });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to create a new point of interest
export const createPointOfInterest = async (req, res) => {
  try {
    const payload = req.body;
    // Create new POI with provided data
    const item = await PointOfInterest.create(payload);

    // Create UserPointOfInterest record to track that this user created this POI
    const userId = req.user.id;
    await UserPointOfInterest.create({
      user_id: userId,
      point_of_interest_id: item.id,
      favorited_at: new Date()
    });

    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to update an existing point of interest
export const updatePointOfInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // Process numeric fields if they come as strings from FormData
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

    // Process boolean field
    if (payload.is_global !== undefined) {
      payload.is_global =
        payload.is_global === true || payload.is_global === "true";
    }

    // Process location_id - set to null if empty
    if (payload.location_id !== undefined && payload.location_id === "") {
      payload.location_id = null;
    }

    // Add image URL if file was uploaded
    if (req.file) {
      payload.image_url = `/uploads/poi-images/${req.file.filename}`;
    }

    // Update POI in database
    const [updated] = await PointOfInterest.update(payload, {
      where: { id },
    });
    if (!updated)
      return res.status(404).json({ error: "PointOfInterest not found" });
    // Fetch and return updated POI
    const updatedItem = await PointOfInterest.findByPk(id);
    return res.json(updatedItem);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to delete a point of interest
export const deletePointOfInterest = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete POI by ID
    const deleted = await PointOfInterest.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ error: "PointOfInterest not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get points of interest by location
export const getPointsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    // Find all POIs associated with the given location
    const items = await PointOfInterest.findAll({
      where: { location_id: locationId },
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

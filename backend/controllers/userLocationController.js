import { UserLocation, User, Location, PointOfInterest, UserPointOfInterest } from "../models/index.js";

const createLocationPOI = async (userId, locationId) => {
  try {
    const location = await Location.findByPk(locationId);
    if (!location) return;

    const existingUserPOI = await PointOfInterest.findOne({
      include: [{
        model: UserPointOfInterest,
        where: { user_id: userId },
        required: true
      }],
      where: {
        name: `Mi municipio: ${location.name}`,
        type: 'local',
      },
    });

    if (!existingUserPOI) {
      const newPOI = await PointOfInterest.create({
        name: `Mi municipio: ${location.name}`,
        latitude: location.latitude,
        longitude: location.longitude,
        is_global: false,
        type: 'local',
      });

      await UserPointOfInterest.create({
        user_id: userId,
        point_of_interest_id: newPOI.id,
        favorited_at: new Date()
      });

      console.log(`Created local POI for user ${userId} in ${location.name}`);
    }
  } catch (error) {
    console.error("Error creating location POI:", error);
  }
};

// Controller function to get all locations favorited by a user
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

// Controller function to add a location to a user's favorites
export const addUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { location_id } = req.body;
    
    const existingUserLocation = await UserLocation.findOne({
      where: { user_id: userId, location_id: location_id },
    });

    if (existingUserLocation) {
      return res
        .status(409)
        .json({ error: "Esta ubicación ya está guardada" });
    }

    const item = await UserLocation.create({
      user_id: userId,
      location_id,
      selected_at: new Date(),
    });
    
    await createLocationPOI(userId, location_id);
    
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

// Controller function to remove a location from a user's favorites
export const removeUserLocation = async (req, res) => {
  try {
    const { userId, locationId } = req.params;
    // Delete the UserLocation mapping
    const deleted = await UserLocation.destroy({
      where: { user_id: userId, location_id: locationId },
    });
    if (!deleted) return res.status(404).json({ error: "Mapping not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

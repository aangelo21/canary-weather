import { UserLocation, User, Location, UserPointOfInterest, PointOfInterest } from "../models/index.js";

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

// Controller function to remove a location from a user's favorites
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

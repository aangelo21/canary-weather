import { PointOfInterest, UserPointOfInterest, UserLocation, Location } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../controllers/dbController.js";

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

    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

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
    return res.json(updatedItem);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deletePointOfInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PointOfInterest.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ error: "PointOfInterest not found" });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

import { User, PointOfInterest, Alert } from "../models/index.js";
import { Op } from "sequelize";

// Controller for admin-related endpoints

// Get admin dashboard
export const getDashboard = async (req, res) => {
  try {
    const { search, isGlobal } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (isGlobal !== undefined && isGlobal !== "") {
      where.is_global = isGlobal === "true";
    }

    const usersCount = await User.count();
    const poisCount = await PointOfInterest.count();
    const alertsCount = await Alert.count();

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

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    return res.render("dashboard", {
      usersCount,
      poisCount,
      alertsCount,
      frontendUrl,
      pois,
      filters: { search, isGlobal },
      token: req.token,
    });
  } catch (err) {
    return res.status(500).send("Error loading dashboard: " + err.message);
  }
};
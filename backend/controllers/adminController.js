import User from "../models/user.js";
import PointOfInterest from "../models/pointOfInterest.js";
import Alert from "../models/alert.js";

// Controller for admin-related endpoints

// Get admin dashboard
export const getDashboard = async (req, res) => {
  try {
    const usersCount = await User.count();
    const poisCount = await PointOfInterest.count();
    const alertsCount = await Alert.count();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    return res.render("dashboard", {
      usersCount,
      poisCount,
      alertsCount,
      frontendUrl,
    });
  } catch (err) {
    return res.status(500).send("Error loading dashboard: " + err.message);
  }
};
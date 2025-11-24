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

    return res.render("dashboard", {
      usersCount,
      poisCount,
      alertsCount,
    });
  } catch (err) {
    return res.status(500).send("Error loading dashboard: " + err.message);
  }
};
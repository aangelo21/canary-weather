// Routes for alert-related API endpoints
import express from "express";
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertsByLocation,
  fetchWarnings,
} from "../controllers/alertController.js";

const router = express.Router();

// Route to get all alerts
router.get("/", getAllAlerts);

// Route to get a specific alert by ID
router.get("/:id", getAlertById);

// Route to create a new alert
router.post("/", createAlert);

// Route to update an existing alert
router.put("/:id", updateAlert);

// Route to delete an alert
router.delete("/:id", deleteAlert);

// Route to get alerts by location
router.get("/location/:locationId", getAlertsByLocation);

// Route to fetch warnings from AEMET
router.post("/fetch", fetchWarnings);

export default router;
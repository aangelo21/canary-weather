// Import Express framework for routing
import express from "express";
// Import controller functions for POI operations
import {
  getAllPointsOfInterest,
  getPointOfInterestById,
  createPointOfInterest,
  updatePointOfInterest,
  deletePointOfInterest,
  getPointsByLocation,
} from "../controllers/pointOfInterestController.js";
// Import multer middleware for POI image uploads
import { uploadPOI } from "../middleware/uploadMiddleware.js";

// Create Express router instance
const router = express.Router();

// Route to get all points of interest
router.get("/", getAllPointsOfInterest);
// Route to get a specific point of interest by ID
router.get("/:id", getPointOfInterestById);
// Route to create a new point of interest
router.post("/", createPointOfInterest);
// Route to update a point of interest, with image upload middleware
router.put("/:id", uploadPOI.single("poi_image"), updatePointOfInterest);
// Route to delete a point of interest
router.delete("/:id", deletePointOfInterest);
// Route to get points of interest by location
router.get("/location/:locationId", getPointsByLocation);

// Export the router for use in the main app
export default router;

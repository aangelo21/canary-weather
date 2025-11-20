// Import Express framework for routing
import express from "express";
// Import controller functions for POI operations
import {
  getAllPointsOfInterest,
  getPersonalPointsOfInterest,
  getPointOfInterestById,
  createPointOfInterest,
  updatePointOfInterest,
  deletePointOfInterest,
  getPointsByLocation,
} from "../controllers/pointOfInterestController.js";
// Import multer middleware for POI image uploads
import { uploadPOI } from "../middleware/uploadMiddleware.js";
// Import authentication middleware
import { authenticateToken, optionalAuthenticateToken } from "../middleware/authenticateToken.js";

// Create Express router instance
const router = express.Router();

// Route to get all points of interest (optional authentication)
router.get("/", optionalAuthenticateToken, getAllPointsOfInterest);
// Route to get only personal POIs for authenticated user
router.get("/personal", authenticateToken, getPersonalPointsOfInterest);
// Route to get a specific point of interest by ID
router.get("/:id", getPointOfInterestById);
// Route to create a new point of interest (requires authentication)
router.post("/", authenticateToken, createPointOfInterest);
// Route to update a point of interest, with image upload middleware (requires authentication)
router.put("/:id", authenticateToken, uploadPOI.single("poi_image"), updatePointOfInterest);
// Route to delete a point of interest (requires authentication)
router.delete("/:id", authenticateToken, deletePointOfInterest);
// Route to get points of interest by location
router.get("/location/:locationId", getPointsByLocation);

// Export the router for use in the main app
export default router;

import express from "express";
import {
  getUserLocations,
  addUserLocation,
  removeUserLocation,
} from "../controllers/userLocationController.js";
import { authenticateSession } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", authenticateSession, getUserLocations);
router.post("/:userId", authenticateSession, addUserLocation);
router.delete("/:userId/:locationId", authenticateSession, removeUserLocation);

export default router;

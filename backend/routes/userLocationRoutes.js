import express from "express";
import {
  getUserLocations,
  addUserLocation,
  removeUserLocation,
} from "../controllers/userLocationController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:userId", authenticateToken, getUserLocations);
router.post("/:userId", authenticateToken, addUserLocation);
router.delete("/:userId/:locationId", authenticateToken, removeUserLocation);

export default router;

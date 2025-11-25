import express from "express";
import {
  getAllPointsOfInterest,
  getPersonalPointsOfInterest,
  getPointOfInterestById,
  createPointOfInterest,
  updatePointOfInterest,
  deletePointOfInterest,
} from "../controllers/pointOfInterestController.js";
import { uploadPOI } from "../middleware/uploadMiddleware.js";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuthenticateToken, getAllPointsOfInterest);
router.get("/personal", authenticateToken, getPersonalPointsOfInterest);
router.get("/:id", getPointOfInterestById);
router.post("/", authenticateToken, createPointOfInterest);
router.put("/:id", authenticateToken, uploadPOI.single("poi_image"), updatePointOfInterest);
router.delete("/:id", authenticateToken, deletePointOfInterest);

export default router;

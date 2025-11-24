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
import { authenticateSession, optionalAuthenticateSession } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuthenticateSession, getAllPointsOfInterest);
router.get("/personal", authenticateSession, getPersonalPointsOfInterest);
router.get("/:id", getPointOfInterestById);
router.post("/", authenticateSession, createPointOfInterest);
router.put("/:id", authenticateSession, uploadPOI.single("poi_image"), updatePointOfInterest);
router.delete("/:id", authenticateSession, deletePointOfInterest);

export default router;

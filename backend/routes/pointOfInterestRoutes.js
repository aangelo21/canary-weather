import express from "express";
import {
    getAllPointsOfInterest,
    getPointOfInterestById,
    createPointOfInterest,
    updatePointOfInterest,
    deletePointOfInterest,
    getPointsByLocation,
} from "../controllers/pointOfInterestController.js";

const router = express.Router();

router.get("/", getAllPointsOfInterest);
router.get("/:id", getPointOfInterestById);
router.post("/", createPointOfInterest);
router.put("/:id", updatePointOfInterest);
router.delete("/:id", deletePointOfInterest);
router.get("/location/:locationId", getPointsByLocation);

export default router;

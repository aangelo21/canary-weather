import express from "express";
import { authenticateSession } from "../middleware/authMiddleware.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { 
    getDashboard, 
    createGlobalPOI, 
    updatePOI, 
    deletePOI 
} from "../controllers/adminController.js";

const router = express.Router();

// GET /admin - Admin dashboard
router.get("/", authenticateSession, checkAdmin, getDashboard);

// POI Management
router.post("/poi", authenticateSession, checkAdmin, createGlobalPOI);
router.post("/poi/:id/update", authenticateSession, checkAdmin, updatePOI);
router.post("/poi/:id/delete", authenticateSession, checkAdmin, deletePOI);

export default router;
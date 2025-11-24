import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { 
    getDashboard, 
    createGlobalPOI, 
    updatePOI, 
    deletePOI 
} from "../controllers/adminController.js";

const router = express.Router();

// GET /admin - Admin dashboard
router.get("/", authenticateToken, checkAdmin, getDashboard);

// POI Management
router.post("/poi", authenticateToken, checkAdmin, createGlobalPOI);
router.post("/poi/:id/update", authenticateToken, checkAdmin, updatePOI);
router.post("/poi/:id/delete", authenticateToken, checkAdmin, deletePOI);

export default router;
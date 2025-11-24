import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { getDashboard } from "../controllers/adminController.js";

const router = express.Router();

// GET /admin - Admin dashboard
router.get("/", authenticateToken, checkAdmin, getDashboard);

export default router;
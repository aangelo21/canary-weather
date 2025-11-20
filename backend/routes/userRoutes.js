// Import Express framework for routing
import express from "express";

// Import controller functions for user operations
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
  getMunicipalities,
} from "../controllers/userController.js";

// Import multer middleware for profile picture uploads
import { upload } from "../middleware/uploadMiddleware.js";

// Create Express router instance
const router = express.Router();

// Import JWT authentication middleware
import { authenticateToken } from "../middleware/authenticateToken.js";

// Public routes (no auth required) - must be defined first
router.post("/login", loginUser);
router.post("/", createUser);
router.get("/municipalities", getMunicipalities);

// Protected routes with specific paths (before /:id)
router.get("/me", authenticateToken, getCurrentUser);

// Protected routes with dynamic parameters
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.put(
  "/:id",
  authenticateToken,
  upload.single("profile_picture"),
  updateUser
);
router.delete("/:id", authenticateToken, deleteUser);

// Export the router for use in the main app
export default router;

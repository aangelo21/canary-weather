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
  logoutUser,
  getCurrentUser,
  getMunicipalities,
  refreshToken,
} from "../controllers/userController.js";

// Import multer middleware for profile picture uploads
import { upload } from "../middleware/uploadMiddleware.js";

// Create Express router instance
const router = express.Router();

// Import authentication middleware
import { authenticateSession, authenticateToken } from "../middleware/authMiddleware.js";

// Public routes (no auth required) - must be defined first
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/", createUser);
router.get("/municipalities", getMunicipalities);

// Refresh Token route (Uses Session Cookie)
router.post("/refresh-token", authenticateSession, refreshToken);

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

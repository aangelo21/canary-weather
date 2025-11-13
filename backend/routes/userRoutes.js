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
} from "../controllers/userController.js";

// Import multer middleware for profile picture uploads
import { upload } from "../middleware/uploadMiddleware.js";

// Create Express router instance
const router = express.Router();

// Import JWT authentication middleware
import { authenticateToken } from "../middleware/authenticateToken.js";

// Public route for user login (no auth required)
router.post("/login", loginUser);
// Protected route to get current authenticated user
router.get("/me", authenticateToken, getCurrentUser);
// Protected route to get all users
router.get("/", authenticateToken, getAllUsers);
// Protected route to get a specific user by ID
router.get("/:id", authenticateToken, getUserById);
// Public route to create a new user
router.post("/", createUser);
// Protected route to update a user, with profile picture upload middleware
router.put("/:id", authenticateToken, upload.single("profile_picture"), updateUser);
// Protected route to delete a user
router.delete("/:id", authenticateToken, deleteUser);

// Export the router for use in the main app
export default router;

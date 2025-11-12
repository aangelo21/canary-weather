import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getCurrentUser,
} from "../controllers/userController.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

import { authenticateToken } from "../middleware/authenticateToken.js";

router.post("/login", loginUser);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.post("/", createUser);
router.put("/:id", authenticateToken, upload.single("profile_picture"), updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;

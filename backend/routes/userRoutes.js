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

const router = express.Router();

import { authenticateToken } from "../middleware/authenticateToken.js";

router.post("/login", loginUser);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.post("/", createUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;

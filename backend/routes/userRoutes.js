import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
} from "../controllers/userController.js";


const router = express.Router();

import { authenticateToken } from "../middleware/authenticateToken.js";

router.post("/login", loginUser);
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.post("/", createUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;

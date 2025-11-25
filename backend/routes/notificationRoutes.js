import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  getNotificationsByUser,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllNotifications);
router.get("/:id", authenticateToken, getNotificationById);
router.get("/user/:userId", authenticateToken, getNotificationsByUser);
router.post("/", authenticateToken, createNotification);
router.put("/:id", authenticateToken, updateNotification);
router.delete("/:id", authenticateToken, deleteNotification);

export default router;

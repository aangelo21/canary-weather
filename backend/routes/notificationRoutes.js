import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  getNotificationsByUser,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";
import { authenticateSession } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateSession, getAllNotifications);
router.get("/:id", authenticateSession, getNotificationById);
router.get("/user/:userId", authenticateSession, getNotificationsByUser);
router.post("/", authenticateSession, createNotification);
router.put("/:id", authenticateSession, updateNotification);
router.delete("/:id", authenticateSession, deleteNotification);

export default router;

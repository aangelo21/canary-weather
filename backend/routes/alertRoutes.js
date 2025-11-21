import express from "express";
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  fetchWarnings,
} from "../controllers/alertController.js";

const router = express.Router();

router.get("/", getAllAlerts);
router.get("/:id", getAlertById);
router.post("/", createAlert);
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);
router.post("/fetch", fetchWarnings);

export default router;
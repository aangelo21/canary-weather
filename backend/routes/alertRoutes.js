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

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all alerts
 *     description: Retrieve all weather alerts
 *     tags: [Alerts]
 *     responses:
 *       200:
 *         description: List of alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getAllAlerts);

/**
 * @swagger
 * /api/alerts/{id}:
 *   get:
 *     summary: Get alert by ID
 *     description: Retrieve a specific alert by its ID
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Alert ID
 *     responses:
 *       200:
 *         description: Alert found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alert'
 *       404:
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getAlertById);

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     summary: Create alert
 *     description: Create a new weather alert
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - severity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Strong wind warning
 *               description:
 *                 type: string
 *                 example: Wind speeds up to 80 km/h expected
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 example: high
 *               location_id:
 *                 type: integer
 *                 nullable: true
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Alert created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alert'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", createAlert);

/**
 * @swagger
 * /api/alerts/{id}:
 *   put:
 *     summary: Update alert
 *     description: Update an existing weather alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Alert ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *               location_id:
 *                 type: integer
 *                 nullable: true
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Alert updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alert'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete alert
 *     description: Delete a weather alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Alert ID
 *     responses:
 *       204:
 *         description: Alert deleted successfully
 *       404:
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);

/**
 * @swagger
 * /api/alerts/fetch:
 *   post:
 *     summary: Fetch warnings from external source
 *     description: Fetch and import weather warnings from external API
 *     tags: [Alerts]
 *     responses:
 *       200:
 *         description: Warnings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/fetch", fetchWarnings);

export default router;

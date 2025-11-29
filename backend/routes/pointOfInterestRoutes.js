import express from "express";
import {
  getAllPointsOfInterest,
  getPersonalPointsOfInterest,
  getPointOfInterestById,
  createPointOfInterest,
  updatePointOfInterest,
  deletePointOfInterest,
} from "../controllers/pointOfInterestController.js";
import { uploadPOI } from "../middleware/uploadMiddleware.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Point of Interest Routes
 * 
 * Defines routes for managing Points of Interest (POIs).
 * Supports retrieving global, local, and personal POIs.
 * Includes routes for creating, updating, and deleting POIs, with image upload support.
 * 
 * Base Path: /api/pois
 */

/**
 * @swagger
 * /api/pois:
 *   get:
 *     summary: Get all points of interest
 *     description: Retrieve all POIs. Returns personalized results if authenticated.
 *     tags: [Points of Interest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of points of interest
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PointOfInterest'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", optionalAuthenticateToken, getAllPointsOfInterest);

/**
 * @swagger
 * /api/pois/personal:
 *   get:
 *     summary: Get personal points of interest
 *     description: Retrieve POIs created by or favorited by the authenticated user
 *     tags: [Points of Interest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of personal POIs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PointOfInterest'
 *       401:
 *         description: Token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/personal", authenticateToken, getPersonalPointsOfInterest);

/**
 * @swagger
 * /api/pois/{id}:
 *   get:
 *     summary: Get point of interest by ID
 *     description: Retrieve a specific POI by its ID
 *     tags: [Points of Interest]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: POI ID
 *     responses:
 *       200:
 *         description: POI found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PointOfInterest'
 *       404:
 *         description: POI not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getPointOfInterestById);

/**
 * @swagger
 * /api/pois:
 *   post:
 *     summary: Create point of interest
 *     description: Create a new POI (requires authentication)
 *     tags: [Points of Interest]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - latitude
 *               - longitude
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Playa de Las Canteras
 *               description:
 *                 type: string
 *                 example: Beautiful beach in Las Palmas
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 28.1456
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: -15.4362
 *               type:
 *                 type: string
 *                 enum: [local, global, personal]
 *                 example: personal
 *               image_url:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: POI created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PointOfInterest'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authenticateToken, createPointOfInterest);

/**
 * @swagger
 * /api/pois/{id}:
 *   put:
 *     summary: Update point of interest
 *     description: Update an existing POI including image upload
 *     tags: [Points of Interest]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: POI ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *                 format: float
 *               longitude:
 *                 type: number
 *                 format: float
 *               type:
 *                 type: string
 *                 enum: [local, global, personal]
 *               poi_image:
 *                 type: string
 *                 format: binary
 *                 description: POI image file
 *     responses:
 *       200:
 *         description: POI updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PointOfInterest'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: POI not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete point of interest
 *     description: Delete a POI
 *     tags: [Points of Interest]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: POI ID
 *     responses:
 *       204:
 *         description: POI deleted successfully
 *       401:
 *         description: Token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: POI not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  authenticateToken,
  uploadPOI.single("poi_image"),
  updatePointOfInterest
);
router.delete("/:id", authenticateToken, deletePointOfInterest);

export default router;

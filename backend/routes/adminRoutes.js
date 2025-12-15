import express from 'express';
import { authenticateSession } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { ensureAdminAuthenticated } from '../middleware/adminAuthMiddleware.js';
import {
    getDashboard,
    createGlobalPOI,
    updatePOI,
    deletePOI,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/adminController.js';

const router = express.Router();



/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard
 *     description: Access the admin dashboard (requires session authentication and admin privileges)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 */
router.get('/', ensureAdminAuthenticated, getDashboard);

/**
 * @swagger
 * /admin/poi:
 *   post:
 *     summary: Create global POI
 *     description: Create a new global point of interest (admin only)
 *     tags: [Admin]
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
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: POI created successfully
 *       401:
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 */
router.post('/poi', authenticateSession, checkAdmin, createGlobalPOI);

/**
 * @swagger
 * /admin/poi/{id}/update:
 *   post:
 *     summary: Update POI
 *     description: Update an existing point of interest (admin only)
 *     tags: [Admin]
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
 *         application/json:
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
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: POI updated successfully
 *       401:
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: POI not found
 */
router.post('/poi/:id/update', authenticateSession, checkAdmin, updatePOI);

/**
 * @swagger
 * /admin/poi/{id}/delete:
 *   post:
 *     summary: Delete POI
 *     description: Delete a point of interest (admin only)
 *     tags: [Admin]
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
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: POI not found
 */
router.post('/poi/:id/delete', authenticateSession, checkAdmin, deletePOI);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create user (admin)
 *     description: Create a new user account (admin only)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 */
router.post('/users', authenticateSession, checkAdmin, createUser);

/**
 * @swagger
 * /admin/users/{id}/update:
 *   post:
 *     summary: Update user (admin)
 *     description: Update an existing user account (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: User not found
 */
router.post('/users/:id/update', authenticateSession, checkAdmin, updateUser);

/**
 * @swagger
 * /admin/users/{id}/delete:
 *   post:
 *     summary: Delete user (admin)
 *     description: Delete a user account (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Session authentication required
 *       403:
 *         description: Admin privileges required
 *       404:
 *         description: User not found
 */
router.post('/users/:id/delete', authenticateSession, checkAdmin, deleteUser);

export default router;

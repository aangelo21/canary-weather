// Import User model and related dependencies
import { User, PointOfInterest, Location, UserPointOfInterest } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// Helper function to create a POI for the user's default location
const createDefaultLocationPOI = async (userId, locationId) => {
  try {
    const location = await Location.findByPk(locationId);
    if (!location) return;

    // Check if this user already has a personal POI for this location
    const existingUserPOI = await PointOfInterest.findOne({
      include: [{
        model: UserPointOfInterest,
        where: { user_id: userId },
        required: true
      }],
      where: {
        location_id: locationId,
        type: 'personal',
      },
    });

    if (!existingUserPOI) {
      // Create the personal POI
      const newPOI = await PointOfInterest.create({
        name: `Mi municipio: ${location.name}`,
        description: `Punto de interés personal para el municipio ${location.name}`,
        latitude: location.latitude,
        longitude: location.longitude,
        is_global: false,
        type: 'personal',
        location_id: locationId,
      });

      // Link the POI to the user
      await UserPointOfInterest.create({
        user_id: userId,
        point_of_interest_id: newPOI.id,
        favorited_at: new Date()
      });

      console.log(`Created personal POI for user ${userId} in ${location.name}`);
    }
  } catch (error) {
    console.error("Error creating default location POI:", error);
  }
};

// Controller function to handle user login with Basic Authentication
export const loginUser = async (req, res) => {
  try {
    // Extract Authorization header and check for Basic auth
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res
        .status(401)
        .json({ error: "Missing Authorization Basic header" });
    }
    // Decode Base64 credentials
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    // Split into username and password
    const [username, password] = credentials.split(":");
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Compare provided password with hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    // Remove password from user object for security
    const safe = user.toJSON();
    delete safe.password;
    // Return token and user data
    return res.json({ token, user: safe });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get the current authenticated user
export const getCurrentUser = async (req, res) => {
  try {
    // Extract user ID from JWT payload (set by middleware)
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Invalid token" });
    // Find user by ID, excluding password
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding passwords
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get a user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find user by primary key, excluding password
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to create a new user
export const createUser = async (req, res) => {
  try {
    const { email, username, password, default_location_id } = req.body;
    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    // Check if email already exists
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    // Create new user (password hashed by model hook)
    const user = await User.create({ email, username, password, default_location_id });
    // Remove password from response
    const safe = user.toJSON();
    delete safe.password;

    // Create default location POI if specified
    if (default_location_id) {
      await createDefaultLocationPOI(user.id, default_location_id);
    }

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    return res.status(201).json({ token, user: safe });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to update an existing user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Handle profile picture upload if present
    if (req.file) {
      payload.profile_picture_url = `/uploads/profile-pictures/${req.file.filename}`;
    }

    // Get current user to check if default_location_id changed
    const currentUser = await User.findByPk(id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // Update user with provided data, enabling individualHooks to trigger beforeUpdate
    await User.update(payload, { where: { id }, individualHooks: true });

    // Create default location POI if default_location_id was changed
    if (payload.default_location_id && payload.default_location_id !== currentUser.default_location_id) {
      await createDefaultLocationPOI(id, payload.default_location_id);
    }

    // Fetch updated user, excluding password
    const updated = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete user by ID
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "User not found" });
    // Return 204 No Content on success
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to get all available municipalities
export const getMunicipalities = async (req, res) => {
  try {
    // Get all locations that are municipalities (not just islands)
    const municipalities = await Location.findAll({
      where: {
        // Assuming municipalities have coordinates (islands might not in some cases)
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
      },
      order: [['name', 'ASC']],
    });
    return res.json(municipalities);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

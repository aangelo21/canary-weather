import { User, Location, UserLocation, UserPointOfInterest, PointOfInterest } from "../models/index.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

// Controller function to handle user login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ 
      where: { username },
      include: [{ model: Location }]
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Compare provided password with hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    // Set user in session
    const safe = user.toJSON();
    delete safe.password;
    
    req.session.user = safe;
    
    // Return user data
    return res.json({ user: safe });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Controller function to logout user
export const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid"); // Default cookie name
    return res.json({ message: "Logged out successfully" });
  });
};

// Controller function to get the current authenticated user
export const getCurrentUser = async (req, res) => {
  try {
    // Extract user ID from session
    const userId = req.session.user && req.session.user.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    // Find user by ID, excluding password
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [{ model: Location }]
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
    const { email, username, password, location_ids } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    const user = await User.create({ email, username, password });
    const safe = user.toJSON();
    delete safe.password;

    if (location_ids && Array.isArray(location_ids)) {
      for (const location_id of location_ids) {
        await UserLocation.create({
          user_id: user.id,
          location_id: location_id,
          selected_at: new Date()
        });

        // Find the location and add the corresponding POI
        const location = await Location.findByPk(location_id);
        if (location) {
          const poi = await PointOfInterest.findOne({
            where: { 
              name: `Municipio: ${location.name}`,
              type: 'local'
            }
          });
          if (poi) {
            await UserPointOfInterest.create({
              user_id: user.id,
              point_of_interest_id: poi.id,
              favorited_at: new Date(),
            });
          }
        }
      }
    }

    // Set user in session
    req.session.user = safe;

    return res.status(201).json({ user: safe });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Controller function to update an existing user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (req.file) {
      payload.profile_picture_url = `/uploads/profile-pictures/${req.file.filename}`;
    }

    const currentUser = await User.findByPk(id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const location_ids = payload.location_ids;
    delete payload.location_ids;
    delete payload.location_id;

    await User.update(payload, { where: { id }, individualHooks: true });

    if (location_ids && Array.isArray(location_ids)) {
      // Remove any existing location for this user
      await UserLocation.destroy({
        where: { user_id: id }
      });

      // Remove existing UserPointOfInterest for local POIs
      const localPois = await PointOfInterest.findAll({
        where: { type: 'local' }
      });
      const localPoiIds = localPois.map(poi => poi.id);
      await UserPointOfInterest.destroy({
        where: { 
          user_id: id,
          point_of_interest_id: localPoiIds
        }
      });

      for (const location_id of location_ids) {
        await UserLocation.create({
          user_id: id,
          location_id: location_id,
          selected_at: new Date()
        });

        // Find the location and add the corresponding POI
        const location = await Location.findByPk(location_id);
        if (location) {
          const poi = await PointOfInterest.findOne({
            where: { 
              name: `Municipio: ${location.name}`,
              type: 'local'
            }
          });
          if (poi) {
            await UserPointOfInterest.create({
              user_id: id,
              point_of_interest_id: poi.id,
              favorited_at: new Date(),
            });
          }
        }
      }
    }

    const updated = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Location }]
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

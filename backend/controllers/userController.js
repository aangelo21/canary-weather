import { Location, UserLocation, UserPointOfInterest, PointOfInterest, UserProfile } from "../models/index.js";
import { LdapService } from "../services/ldapService.js";
import { sendWelcomeEmail, sendLoginNotification } from "../services/emailService.js";
import { Op } from "sequelize";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Authenticates a user and returns a JWT token.
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Authenticate against LDAP
    const user = await LdapService.authenticate(username, password);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Send login notification
    if (user.email) {
        sendLoginNotification(user.email, user.username);
    }
    
    // Set user in session
    req.session.user = {
      id: user.username, // Use username as ID
      username: user.username,
      is_admin: user.isAdmin
    };

    // Generate JWT
    const token = jwt.sign({ 
      id: user.username, 
      username: user.username, 
      is_admin: user.isAdmin 
    }, JWT_SECRET, { expiresIn: '15m' });
    
    // Return user data and token
    return res.json({ user: req.session.user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

/**
 * Refreshes the JWT token for an authenticated user.
 */
export const refreshToken = async (req, res) => {
  const user = req.user;
  const token = jwt.sign({ 
    id: user.id, 
    username: user.username, 
    is_admin: user.is_admin 
  }, JWT_SECRET, { expiresIn: '15m' });
  
  return res.json({ token });
};

/**
 * Logs out the current user.
 */
export const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
};

/**
 * Retrieves the currently authenticated user's profile.
 */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.session.user && req.session.user.id; // This is the username now
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    // Fetch associated locations
    // We need to manually fetch locations because we removed the Sequelize association
    const userLocations = await UserLocation.findAll({
      where: { user_id: userId },
      include: [{ model: Location }]
    });

    const locations = userLocations.map(ul => ul.Location);

    // Fetch user profile (for profile picture)
    const userProfileData = await UserProfile.findByPk(userId);

    const userProfile = {
      id: userId,
      username: userId,
      is_admin: req.session.user.is_admin,
      profile_picture_url: userProfileData ? userProfileData.profile_picture_url : null,
      bio: userProfileData ? userProfileData.bio : null,
      Locations: locations
    };

    return res.json(userProfile);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all users.
 * Not fully implemented for LDAP yet (would require search).
 */
export const getAllUsers = async (req, res) => {
  return res.status(501).json({ error: "Not implemented for LDAP" });
};

/**
 * Retrieves a specific user by ID (username).
 */
export const getUserById = async (req, res) => {
  // Not implemented
  return res.status(501).json({ error: "Not implemented for LDAP" });
};

/**
 * Creates a new user account in LDAP.
 */
export const createUser = async (req, res) => {
  try {
    const { email, username, password, location_ids } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Check if user exists in LDAP (optional, createUser might fail if exists)
    const exists = await LdapService.userExists(username);
    if (exists) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    // Create in LDAP
    await LdapService.createUser(username, email, password);

    // Send welcome email
    sendWelcomeEmail(email, username);

    const safeUser = {
      id: username,
      username: username,
      email: email,
      is_admin: false // Default for new users
    };

    if (location_ids && Array.isArray(location_ids)) {
      for (const location_id of location_ids) {
        await UserLocation.create({
          user_id: username,
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
              user_id: username,
              point_of_interest_id: poi.id,
              favorited_at: new Date(),
            });
          }
        }
      }
    }

    // Set user in session
    req.session.user = safeUser;

    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error creating user: " + err.message });
  }
};

/**
 * Updates an existing user's profile (Locations and Profile Picture).
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // This is the username
    const payload = { ...req.body };

    // Handle Profile Picture Upload
    if (req.file) {
      const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
      
      // Find or create the user profile
      const [profile, created] = await UserProfile.findOrCreate({
        where: { username: id },
        defaults: { profile_picture_url: profilePictureUrl }
      });

      if (!created) {
        profile.profile_picture_url = profilePictureUrl;
        await profile.save();
      }
    }

    // We only support updating locations for now
    const location_ids = payload.location_ids;

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

    // Return updated profile
    // Fetch associated locations
    const userLocations = await UserLocation.findAll({
      where: { user_id: id },
      include: [{ model: Location }]
    });

    const locations = userLocations.map(ul => ul.Location);

    // Fetch updated profile data
    const userProfileData = await UserProfile.findByPk(id);

    const updated = {
      id: id,
      username: id,
      profile_picture_url: userProfileData ? userProfileData.profile_picture_url : null,
      Locations: locations
    };

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deletes a user account.
 */
export const deleteUser = async (req, res) => {
  return res.status(501).json({ error: "Not implemented for LDAP" });
};

/**
 * Retrieves all available municipalities.
 */
export const getMunicipalities = async (req, res) => {
  try {
    const municipalities = await Location.findAll({
      where: {
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

import { Location, UserLocation, UserPointOfInterest, PointOfInterest, User, UserProfile } from "../models/index.js";
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
    const ldapUser = await LdapService.authenticate(username, password);
    
    if (!ldapUser) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Find or Create User in DB
    let user = await User.findOne({ where: { username: username } });
    if (!user) {
        // If user exists in LDAP but not in DB, create them in DB
        user = await User.create({
            username: username,
            email: ldapUser.email || `${username}@example.com`, // Fallback if email missing
            is_admin: false // Default to false, admin management is now DB based
        });
    }

    // Send login notification
    if (user.email) {
        sendLoginNotification(user.email, user.username);
    }
    
    // Set user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin
    };

    // Generate JWT
    const token = jwt.sign({ 
      id: user.id, 
      username: user.username, 
      email: user.email,
      is_admin: user.is_admin 
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
  // Ensure we are using the DB user ID
  const token = jwt.sign({ 
    id: user.id, 
    username: user.username, 
    email: user.email,
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
    const userId = req.session.user && req.session.user.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findByPk(userId, {
        include: [
            { model: UserLocation, include: [Location] }
        ]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const locations = user.UserLocations ? user.UserLocations.map(ul => ul.Location) : [];

    // Fetch user profile (for profile picture)
    const userProfileData = await UserProfile.findByPk(userId);

    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_picture_url: user.profile_picture_url,
      is_admin: user.is_admin,
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

    // Check if user exists in LDAP
    const exists = await LdapService.userExists(username);
    if (exists) {
      // If user exists in LDAP, check if they exist in DB
      const dbUser = await User.findOne({ where: { username } });
      if (!dbUser) {
          // Inconsistent state: User in LDAP but not DB.
          // We can allow "registration" to proceed to fix the DB entry, 
          // but we should probably verify the password if we were doing a login.
          // Since this is registration, we can't verify the old password easily without asking for it.
          // However, if the user is trying to register, they are providing a password.
          // We could try to authenticate with the provided password to verify ownership.
          
          const authenticated = await LdapService.authenticate(username, password);
          if (authenticated) {
              // User owns the LDAP account, so we create the DB entry
              const user = await User.create({
                  username,
                  email,
                  is_admin: false
              });
              
              // Continue with post-creation logic (emails, locations, etc.)
              // ... duplicate logic below, let's refactor or just fall through
          } else {
              return res.status(409).json({ error: "El usuario ya existe en LDAP (contraseña incorrecta)" });
          }
      } else {
          return res.status(409).json({ error: "El usuario ya existe" });
      }
    } else {
        // Create in LDAP
        await LdapService.createUser(username, email, password);
    }
    
    // Check if user exists in DB (if we didn't just create them above)
    let user = await User.findOne({ where: { username } });
    if (!user) {
        // Create in DB
        user = await User.create({
            username,
            email,
            is_admin: false
        });
    }

    // Send welcome email
    sendWelcomeEmail(email, username);

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

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin
    };

    // Set user in session
    req.session.user = safeUser;

    // Generate JWT for the new user
    const token = jwt.sign({ 
      id: safeUser.username, 
      username: safeUser.username, 
      is_admin: safeUser.is_admin 
    }, JWT_SECRET, { expiresIn: '15m' });

    return res.status(201).json({ user: safeUser, token });
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
    const { id } = req.params; // This is the UUID now
    const payload = { ...req.body };

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update profile fields
    if (req.file) {
      // Construct the URL for the uploaded file
      // Assuming the server serves uploads from /uploads/profile-pictures
      // You might need to adjust the path based on your static file serving configuration
      user.profile_picture_url = `/uploads/profile-pictures/${req.file.filename}`;
    } else if (payload.profile_picture_url) {
        user.profile_picture_url = payload.profile_picture_url;
    }

    // Update password if provided
    if (payload.password) {
        await LdapService.updateUser(user.username, { password: payload.password });
    }

    // Only admin can update is_admin, but let's assume this endpoint is protected or logic is elsewhere
    // For now, let's just save the user if changed
    await user.save();

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
    const updatedUser = await User.findByPk(id, {
        include: [{ model: UserLocation, include: [Location] }]
    });
    
    const locations = updatedUser.UserLocations ? updatedUser.UserLocations.map(ul => ul.Location) : [];

    // Fetch updated profile data
    const userProfileData = await UserProfile.findByPk(id);

    const updated = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      profile_picture_url: updatedUser.profile_picture_url,
      is_admin: updatedUser.is_admin,
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

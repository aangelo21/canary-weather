import {
    authenticateUser,
    refreshUserToken,
} from '../services/auth/authService.js';
import { verifyRefreshToken } from '../services/auth/tokenService.js';
import {
    getUserProfile,
    registerUser,
    updateUserProfile,
    getMunicipalities as fetchMunicipalities,
    sendContactMessage,
} from '../services/user/userManagementService.js';
import { User } from '../models/index.js';

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authenticateUser(username, password);

        return res.json({ user: result.user, token: result.token, refreshToken: result.refreshToken });
    } catch (err) {
        console.error(err);
        const statusCode =
            err.message === 'Invalid username or password' ? 401 : 500;
        return res
            .status(statusCode)
            .json({ error: err.message || 'Authentication failed' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        const decoded = verifyRefreshToken(token);
        if (!decoded) {
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }

        const newToken = refreshUserToken(user);
        return res.json({ token: newToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to refresh token' });
    }
};

export const logoutUser = async (req, res) => {
    return res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userProfile = await getUserProfile(userId);
        return res.json(userProfile);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'profile_picture_url', 'is_admin', 'createdAt'],
        });
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'email', 'profile_picture_url', 'is_admin', 'createdAt'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const result = await registerUser(req.body);

        return res.status(201).json({ user: result.user, token: result.token, refreshToken: result.refreshToken });
    } catch (err) {
        console.error(err);
        const statusCode = err.message.includes('ya existe') ? 409 : 400;
        return res.status(statusCode).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateUserProfile(id, req.body, req.file);
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();

        return res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        return res.status(500).json({ error: err.message || 'Failed to delete user' });
    }
};

export const getMunicipalities = async (req, res) => {
    try {
        const municipalities = await fetchMunicipalities();
        return res.json(municipalities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const contactSupport = async (req, res) => {
    try {
        const { name, subject, message } = req.body;
        const userEmail = req.user ? req.user.email : req.body.email;

        const result = await sendContactMessage(
            userEmail,
            name,
            subject,
            message,
        );
        return res.json(result);
    } catch (err) {
        console.error('Contact support error:', err);
        return res
            .status(500)
            .json({ error: err.message || 'Internal server error' });
    }
};

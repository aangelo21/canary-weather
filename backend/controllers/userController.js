import {
    authenticateUser,
    refreshUserToken,
    createSessionData,
} from '../services/auth/authService.js';
import {
    getUserProfile,
    registerUser,
    updateUserProfile,
    getMunicipalities as fetchMunicipalities,
    sendContactMessage,
} from '../services/user/userManagementService.js';
import { LdapService } from '../services/ldapService.js';
import { User } from '../models/index.js';

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authenticateUser(username, password);

        req.session.user = result.user;

        return res.json({ user: result.user, token: result.token });
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
        const user = req.user;
        const token = refreshUserToken(user);
        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to refresh token' });
    }
};

export const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out successfully' });
    });
};

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.id;
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
    return res.status(501).json({ error: 'Not implemented for LDAP' });
};

export const getUserById = async (req, res) => {
    return res.status(501).json({ error: 'Not implemented for LDAP' });
};

export const createUser = async (req, res) => {
    try {
        const result = await registerUser(req.body);

        req.session.user = result.user;

        return res.status(201).json({ user: result.user, token: result.token });
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

        if (user.username) {
            await LdapService.deleteUser(user.username);
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

import { User } from '../../models/index.js';
import { sendLoginNotification } from '../emailService.js';
import { generateAccessToken, generateRefreshToken } from './tokenService.js';
import bcrypt from 'bcrypt';

export const authenticateUser = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const user = await User.findOne({ where: { username: username } });

    if (!user || !user.password) {
        throw new Error('Invalid username or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid username or password');
    }

    if (user.email) {
        sendLoginNotification(user.email, user.username);
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_picture_url: user.profile_picture_url,
            is_admin: user.is_admin,
        },
        token,
        refreshToken,
    };
};

export const refreshUserToken = (user) => {
    return generateAccessToken(user);
};

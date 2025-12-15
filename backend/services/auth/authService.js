import { User } from '../../models/index.js';
import { LdapService } from '../ldapService.js';
import { sendLoginNotification } from '../emailService.js';
import { generateAccessToken } from './tokenService.js';

export const authenticateUser = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const ldapUser = await LdapService.authenticate(username, password);

    if (!ldapUser) {
        throw new Error('Invalid username or password');
    }

    let user = await User.findOne({ where: { username: username } });

    if (!user) {
        user = await User.create({
            username: username,
            email: ldapUser.email || `${username}@example.com`,
            is_admin: false,
        });
    }

    if (user.email) {
        sendLoginNotification(user.email, user.username);
    }

    const token = generateAccessToken(user);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_picture_url: user.profile_picture_url,
            is_admin: user.is_admin,
        },
        token,
    };
};

export const refreshUserToken = (user) => {
    return generateAccessToken(user);
};

export const createSessionData = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
        is_admin: user.is_admin,
    };
};

import { User } from '../../models/index.js';
import { LdapService } from '../ldapService.js';
import { sendPasswordResetEmail } from '../emailService.js';
import { generateResetToken, verifyToken } from './tokenService.js';
import { generateAccessToken } from './tokenService.js';

export const initiatePasswordReset = async (email) => {
    const users = await LdapService.getAllUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
        return { success: true };
    }

    const token = generateResetToken(user);
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, resetLink);

    return { success: true };
};

export const resetUserPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new Error('Token and new password are required');
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== 'reset') {
        throw new Error('Invalid or expired token');
    }

    await LdapService.updateUser(decoded.id, { password: newPassword });

    const dbUser = await User.findOne({ where: { username: decoded.id } });

    if (!dbUser) {
        return {
            message: 'Password has been reset successfully',
            autoLogin: false,
        };
    }

    const loginToken = generateAccessToken(dbUser);

    return {
        message: 'Password has been reset successfully',
        autoLogin: true,
        token: loginToken,
        user: {
            id: dbUser.id,
            username: dbUser.username,
            is_admin: dbUser.is_admin,
        },
    };
};

import { User } from '../../models/index.js';
import { sendPasswordResetEmail } from '../emailService.js';
import { generateResetToken, verifyToken } from './tokenService.js';
import { generateAccessToken } from './tokenService.js';
import bcrypt from 'bcrypt';

export const initiatePasswordReset = async (email) => {
    const user = await User.findOne({ where: { email } });

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

    const dbUser = await User.findOne({ where: { username: decoded.id } });

    if (!dbUser) {
        return {
            message: 'Password has been reset successfully',
            autoLogin: false,
        };
    }

    const salt = await bcrypt.genSalt(10);
    dbUser.password = await bcrypt.hash(newPassword, salt);
    await dbUser.save();

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

import {
    initiatePasswordReset,
    resetUserPassword,
} from '../services/auth/passwordService.js';

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        await initiatePasswordReset(email);

        return res.json({
            message:
                'If an account with that email exists, a password reset link has been sent.',
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res
                .status(400)
                .json({ error: 'Token and new password are required' });
        }

        const result = await resetUserPassword(token, newPassword);

        return res.json({
            message: result.message,
            ...(result.autoLogin && { token: result.token, user: result.user }),
        });
    } catch (err) {
        console.error('Reset password error:', err);
        return res
            .status(400)
            .json({ error: err.message || 'Failed to reset password' });
    }
};

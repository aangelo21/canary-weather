import { LdapService } from "../services/ldapService.js";
import { sendPasswordResetEmail } from "../services/emailService.js";
import { User } from "../models/index.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Initiates the password reset process.
 * Generates a reset token and sends an email to the user.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email in LDAP
    // Since LdapService.authenticate uses username, we need a way to find by email.
    // LdapService.getAllUsers returns all users with email.
    // This is inefficient but works for now given the constraints.
    const users = await LdapService.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      // For security, don't reveal if user exists
      return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    // Generate a reset token
    // We'll sign the token with the user's current password hash (or something that changes)
    // so that once the password is changed, the token becomes invalid.
    // But we don't have the password hash from LDAP easily.
    // So we'll just use a short expiration time.
    const token = jwt.sign(
      { id: user.username, email: user.email, type: 'reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Construct reset link (pointing to frontend)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    // Send email
    await sendPasswordResetEmail(email, resetLink);

    return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

/**
 * Resets the user's password using a valid token.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: "Invalid token type" });
    }

    // Update password in LDAP
    await LdapService.updateUser(decoded.id, { password: newPassword });

    // Auto-login: Generate new token and return user data
    // Fetch DB user
    const dbUser = await User.findOne({ where: { username: decoded.id } });

    if (!dbUser) {
        return res.json({ message: "Password has been reset successfully, but could not auto-login." });
    }

    // Generate login token (same as in userController login)
    const loginToken = jwt.sign(
        { id: dbUser.id, username: dbUser.username, is_admin: dbUser.is_admin },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Set cookie if your app uses cookies for session
    res.cookie('token', loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({ 
        message: "Password has been reset successfully.",
        token: loginToken,
        user: {
            id: dbUser.id,
            username: dbUser.username,
            is_admin: dbUser.is_admin
        }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};

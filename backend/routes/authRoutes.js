import express from 'express';
import passport from 'passport';
import { generateAccessToken } from '../services/auth/tokenService.js';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Google Auth
router.get(
    '/google',
    (req, res, next) => {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            return res.send(`
                <html>
                    <head><title>Google Login Not Configured</title></head>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1>Google Login Not Configured</h1>
                        <p>To enable Google Login, you need to configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the backend .env file.</p>
                        <p><a href="${FRONTEND_URL}">Back to App</a></p>
                    </body>
                </html>
            `);
        }
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateAccessToken(req.user);
        // Redirect to frontend with token
        res.redirect(`${FRONTEND_URL}?token=${token}`);
    },
);

// GitHub Auth
router.get(
    '/github',
    (req, res, next) => {
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
            return res.send(`
                <html>
                    <head><title>GitHub Login Not Configured</title></head>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1>GitHub Login Not Configured</h1>
                        <p>To enable GitHub Login, you need to configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in the backend .env file.</p>
                        <p><a href="${FRONTEND_URL}">Back to App</a></p>
                    </body>
                </html>
            `);
        }
        next();
    },
    passport.authenticate('github', { scope: ['user:email'] }),
);

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateAccessToken(req.user);
        res.redirect(`${FRONTEND_URL}?token=${token}`);
    },
);

export default router;

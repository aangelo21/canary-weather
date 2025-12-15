import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware function to authenticate sessions (Used for Refresh Token)
export function authenticateSession(req, res, next) {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }
    return res.status(401).json({ error: 'Session authentication required' });
}

// Middleware function to authenticate JWT (Used for API protection)
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Optional authentication middleware - checks for token but doesn't fail
export function optionalAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            } else {
                req.user = null;
            }
            next();
        });
    } else {
        req.user = null;
        next();
    }
}

// Optional authentication middleware - doesn't fail if no session (Legacy/Session based)
export function optionalAuthenticateSession(req, res, next) {
    if (req.session && req.session.user) {
        req.user = req.session.user;
    } else {
        req.user = null;
    }
    next();
}

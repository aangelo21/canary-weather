import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function ensureAdminAuthenticated(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Also check for token in query string (for admin dashboard redirects)
    const queryToken = req.query.token;
    const jwtToken = token || queryToken;

    if (!jwtToken) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(frontendUrl);
    }

    try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        if (!decoded.is_admin) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(frontendUrl);
        }
        req.user = decoded;
        return next();
    } catch (err) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(frontendUrl);
    }
}

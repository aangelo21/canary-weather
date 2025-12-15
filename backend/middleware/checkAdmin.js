// Middleware to check if the authenticated user is an admin
export function checkAdmin(req, res, next) {
    // Check if user is authenticated and is_admin is true
    if (!req.user || !req.user.is_admin) {
        return res
            .status(403)
            .json({ error: 'Access denied. Admin privileges required.' });
    }
    // Proceed to next middleware/route handler
    next();
}

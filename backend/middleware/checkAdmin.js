
export function checkAdmin(req, res, next) {
    
    if (!req.user || !req.user.is_admin) {
        return res
            .status(403)
            .json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
}

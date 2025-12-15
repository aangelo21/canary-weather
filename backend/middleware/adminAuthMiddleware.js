export function ensureAdminAuthenticated(req, res, next) {
    
    if (req.session && req.session.user && req.session.user.is_admin) {
        req.user = req.session.user;
        return next();
    }

    
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    
    
    return res.redirect(frontendUrl);
}

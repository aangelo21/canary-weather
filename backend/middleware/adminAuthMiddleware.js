
export function ensureAdminAuthenticated(req, res, next) {
  // Check if user is authenticated via session and is an admin
  if (req.session && req.session.user && req.session.user.is_admin) {
    req.user = req.session.user;
    return next();
  }
  
  // If not authenticated or not admin, redirect to frontend
  // You might want to redirect to a specific error page or login page
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  
  // If we want to be more specific, we could check if they are logged in but not admin
  // and redirect to a "not authorized" page, but redirecting to home is safe.
  return res.redirect(frontendUrl);
}

// Middleware function to authenticate sessions
export function authenticateSession(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

// Optional authentication middleware - doesn't fail if no session
export function optionalAuthenticateSession(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  } else {
    req.user = null;
  }
  next();
}

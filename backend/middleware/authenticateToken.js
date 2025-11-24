// Import JWT library for token verification
import jwt from "jsonwebtoken";

// Middleware function to authenticate JWT tokens in requests
export function authenticateToken(req, res, next) {
  // Extract Authorization header and check for Bearer token
  const authHeader = req.headers["authorization"];
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    // Allow token via query parameter for EJS views
    token = req.query.token;
  } else if (req.body && req.body.token) {
    // Allow token via body for form submissions
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Bearer token required" });
  }

  // Get JWT secret from environment variables
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET not defined in .env" });
  }
  // Verify the token and decode payload
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    // Attach decoded user data to request object
    req.user = user;
    // Attach raw token to request object for views
    req.token = token;
    // Proceed to next middleware/route handler
    next();
  });
}

// Optional authentication middleware - doesn't fail if no token
export function optionalAuthenticateToken(req, res, next) {
  // Extract Authorization header and check for Bearer token
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue without authentication
    req.user = null;
    return next();
  }
  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  // Get JWT secret from environment variables
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // No secret defined, continue without authentication
    req.user = null;
    return next();
  }
  // Verify the token and decode payload
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      // Token invalid, continue without authentication
      req.user = null;
      return next();
    }
    // Attach decoded user data to request object
    req.user = user;
    // Proceed to next middleware/route handler
    next();
  });
}

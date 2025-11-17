// Import JWT library for token verification
import jwt from "jsonwebtoken";

// Middleware function to authenticate JWT tokens in requests
export function authenticateToken(req, res, next) {
  // Extract Authorization header and check for Bearer token
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Bearer token required" });
  }
  // Extract the token from the header
  const token = authHeader.split(" ")[1];
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
    // Proceed to next middleware/route handler
    next();
  });
}

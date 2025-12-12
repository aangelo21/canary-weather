# Authentication & Authorization

This document explains the authentication and authorization system used in CanaryWeather.

## Overview

CanaryWeather uses a **hybrid authentication system**:

1.  **LDAP (Lightweight Directory Access Protocol)** for user identity and credential verification.
2.  **JWT (JSON Web Tokens)** for API endpoints authorization.
3.  **Express Sessions** for state management in some contexts.

## LDAP Authentication

### How It Works

1.  User submits credentials (username/password).
2.  Server connects to the LDAP server.
3.  Server binds as admin to search for the user DN (Distinguished Name).
4.  Server attempts to bind as the user to verify the password.
5.  Server checks group membership (`admins`, `normals`) to determine roles.
6.  If successful, a JWT is generated and returned to the client.

### LDAP Service

The `LdapService` handles all interactions with the LDAP server:

-   **Authenticate**: Verifies credentials and retrieves user details.
-   **Create User**: Adds new users to LDAP and assigns them to the `normals` group.
-   **Update User**: Modifies email, password, or admin status.
-   **Delete User**: Removes user and their group memberships.

## JWT Authentication

### Token Structure

```javascript
{
  "id": "username",       // LDAP username serves as ID
  "username": "username",
  "is_admin": false,
  "iat": 1234567890,
  "exp": 1234568790
}
```

### Implementation

#### Login Controller

```javascript
// backend/controllers/userController.js
import { LdapService } from "../services/ldapService.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Authenticate against LDAP
  const user = await LdapService.authenticate(username, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.username, username: user.username, is_admin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return res.json({ user, token });
};
```

#### Validating Tokens

```javascript
// backend/middleware/authMiddleware.js
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}
```

### Using JWT in Frontend

```javascript
// Store token after login
localStorage.setItem("token", response.data.token);

// Include in API requests
axios.get("/api/users/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

### Token Refresh

```javascript
// Refresh token using session
export const refreshToken = async (req, res) => {
  const user = req.user; // From session

  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  return res.json({ token });
};
```

## Session Authentication

### How It Works

1. User logs in
2. Server creates session
3. Session stored in database
4. Session ID sent as cookie
5. Cookie included in subsequent requests
6. Server validates session on each request

### Configuration

```javascript
// backend/index.js
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true for HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

### Session Middleware

```javascript
// backend/middleware/authMiddleware.js
export function authenticateSession(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ error: "Session authentication required" });
}
```

## Authorization

### User Roles

- **Regular User**: Can manage own data
- **Admin**: Can manage all data and access admin dashboard

### Admin Check Middleware

```javascript
// backend/middleware/checkAdmin.js
export function checkAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: "Admin privileges required" });
  }
  next();
}
```

### Protected Routes

```javascript
// JWT protected
router.get("/api/users/me", authenticateToken, getCurrentUser);

// Admin only (session + admin check)
router.get("/admin", authenticateSession, checkAdmin, getDashboard);
```

## Password Security

### LDAP Handling

Password security is managed by the LDAP server. The application does not store password hashes in its own database.

-   **Verification**: Done by attempting to bind to the LDAP server with the provided credentials.
-   **Storage**: Handled by the LDAP directory (e.g., OpenLDAP) using its configured hashing algorithms (e.g., SSHA).

### Password Reset

Password reset is handled via email verification:

1.  User requests password reset.
2.  System verifies email exists in LDAP.
3.  System sends a reset link with a signed JWT.
4.  User provides new password.
5.  System updates the password in LDAP via `LdapService.updateUser`.

## Security Best Practices

### Environment Variables

```env
# Use strong, random secrets
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
SESSION_SECRET=your_super_secret_session_key_minimum_32_characters
```

### Token Security

1. **Short Expiry**: Tokens expire in 15 minutes
2. **HTTPS Only**: Use secure cookies in production
3. **HttpOnly Cookies**: Prevent XSS attacks
4. **No Sensitive Data**: Don't store sensitive data in tokens

### Password Requirements

Recommended requirements (implement in frontend):

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Rate Limiting

Consider implementing rate limiting for authentication endpoints:

```javascript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login attempts, please try again later",
});

router.post("/login", loginLimiter, loginUser);
```

## Authentication Flow Diagrams

### Login Flow

```
User → POST /api/users/login
       ├── Validate credentials
       ├── Generate JWT token
       ├── Create session
       └── Return { user, token }
              ↓
Client stores token
              ↓
Subsequent requests include:
Authorization: Bearer <token>
```

### Protected Endpoint Flow

```
Client → GET /api/users/me
         + Authorization: Bearer <token>
              ↓
Server → authenticateToken middleware
         ├── Extract token
         ├── Verify token
         ├── Check expiry
         └── Attach user to req.user
              ↓
Controller → Process request
              ↓
Response → User data
```

## Common Issues

### Token Expired

**Error**: `403 Invalid or expired token`

**Solution**: Refresh token or re-login

```javascript
// Refresh token
const response = await axios.post("/api/users/refresh-token");
localStorage.setItem("token", response.data.token);
```

### CORS Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: Configure CORS in backend

```javascript
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

### Session Not Persisting

**Error**: Session lost on page refresh

**Solution**: Ensure cookies are enabled and CORS credentials are set

```javascript
// Frontend
axios.defaults.withCredentials = true;

// Backend
app.use(cors({ credentials: true }));
```

## Testing Authentication

### Using Swagger UI

1. Go to http://localhost:85/api/docs
2. Click "Authorize" button
3. Enter: `Bearer <your-token>`
4. Test protected endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:85/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password"}'

# Use token
curl -X GET http://localhost:85/api/users/me \
  -H "Authorization: Bearer <token>"
```

---

**Related Documentation**:

- [API Documentation](api.md)
- [Security Policy](../SECURITY.md)
- [Backend Documentation](BACKEND.md)

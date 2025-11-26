# Authentication & Authorization

This document explains the authentication and authorization system used in CanaryWeather.

## Overview

CanaryWeather uses a **dual authentication system**:

1. **JWT (JSON Web Tokens)** for API endpoints
2. **Express Sessions** for admin dashboard

## JWT Authentication

### How It Works

1. User logs in with credentials
2. Server validates credentials
3. Server generates JWT token (15-minute expiry)
4. Client stores token (localStorage/memory)
5. Client includes token in subsequent requests
6. Server validates token on each request

### Token Structure

```javascript
{
  "id": "user-uuid",
  "username": "johndoe",
  "is_admin": false,
  "iat": 1234567890,  // Issued at
  "exp": 1234568790   // Expires at (15 minutes)
}
```

### Implementation

#### Generating Tokens

```javascript
// backend/controllers/userController.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate credentials
  const user = await User.findOne({ where: { username } });
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin },
    JWT_SECRET,
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

### Password Hashing

```javascript
// backend/models/user.js
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);
```

### Password Validation

```javascript
const match = await bcrypt.compare(plainPassword, hashedPassword);
if (!match) {
  return res.status(401).json({ error: "Invalid password" });
}
```

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

1. Go to http://localhost:85/api-docs
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

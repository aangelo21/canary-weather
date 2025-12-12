# CanaryWeather API Documentation

## Swagger UI

Interactive API documentation is available in two environments:

> **Note**: To access the development Swagger, you must have cloned the repository and followed all the necessary steps to run the project locally.

- **Development**: http://localhost:85/api/docs
- **Production**: https://canaryweather.xyz/api/docs

### Features

- 📚 **Complete Documentation** of all endpoints
- 🔐 **Integrated JWT Authentication** (LDAP-based)
- 🧪 **Live API Testing**
- 📋 **Detailed Data Schemas**
- ✅ **Request/Response Validation**

## How to Use Authentication in Swagger

### Step 1: Create an Account or Login

#### Option A: Register a New User

1. Go to the **Authentication** section in Swagger UI
2. Expand the `POST /api/users` endpoint (Register new user)
3. Click "Try it out"
4. Fill in the JSON with your data:
   ```json
   {
     "email": "your@email.com",
     "username": "yourname",
     "password": "yourpassword"
   }
   ```
   *Note: This creates a user in the LDAP directory. The username will be used as the unique identifier.*
5. Click "Execute"
6. In the response, **copy the `token` value** (valid for 15 minutes)

#### Option B: Login with Existing User

1. Go to the **Authentication** section in Swagger UI
2. Expand the `POST /api/users/login` endpoint (Login user)
3. Click "Try it out"
4. Fill in the JSON:
   ```json
   {
     "username": "yourname",
     "password": "yourpassword"
   }
   ```
5. Click "Execute"
6. In the response, **copy the `token` value**

### Step 2: Authorize in Swagger

1. Click the **"Authorize"** button 🔓 (top right in Swagger UI)
2. In the "Value" field, paste your token in the format:
   ```
   Bearer <your-token-here>
   ```
   Example:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click "Authorize"
4. Close the modal

### Step 3: Use Protected Endpoints

Now you can use any endpoint that requires authentication. Protected endpoints have a lock icon 🔒.

**Example**: Get your user profile

1. Expand `GET /api/users/me`
2. Click "Try it out"
3. Click "Execute"
4. You'll see your user information in the response

## Available Endpoints

### 🔐 Authentication

- `POST /api/users` - Register new user (returns token)
- `POST /api/users/login` - Login (returns token)
- `POST /api/users/logout` - Logout
- `POST /api/users/refresh-token` - Refresh JWT token

### 👤 Users

- `GET /api/users/me` - Get current user 🔒
- `GET /api/users` - List all users 🔒
- `GET /api/users/{id}` - Get user by ID 🔒
- `PUT /api/users/{id}` - Update user 🔒
- `DELETE /api/users/{id}` - Delete user 🔒
- `GET /api/users/municipalities` - Get municipalities

### 📍 Points of Interest

- `GET /api/pois` - List POIs
- `GET /api/pois/personal` - Personal POIs 🔒
- `GET /api/pois/{id}` - Get POI by ID
- `POST /api/pois` - Create POI 🔒
- `PUT /api/pois/{id}` - Update POI 🔒
- `DELETE /api/pois/{id}` - Delete POI 🔒

### ⚠️ Alerts

- `GET /api/alerts` - List alerts
- `GET /api/alerts/{id}` - Get alert by ID
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/{id}` - Update alert
- `DELETE /api/alerts/{id}` - Delete alert
- `POST /api/alerts/fetch` - Fetch external alerts

### 🔔 Notifications

- `GET /api/notifications` - List notifications 🔒
- `GET /api/notifications/{id}` - Get notification 🔒
- `GET /api/notifications/user/{userId}` - Notifications by user 🔒
- `POST /api/notifications` - Create notification 🔒
- `PUT /api/notifications/{id}` - Update notification 🔒
- `DELETE /api/notifications/{id}` - Delete notification 🔒

### 📍 User Locations

- `GET /api/user-locations/{userId}` - User locations 🔒
- `POST /api/user-locations/{userId}` - Add location 🔒
- `DELETE /api/user-locations/{userId}/{locationId}` - Remove location 🔒

### 👨‍💼 Admin

- `GET /admin` - Admin dashboard (requires session and admin privileges)
- `POST /admin/poi` - Create global POI (admin)
- `POST /admin/poi/{id}/update` - Update POI (admin)
- `POST /admin/poi/{id}/delete` - Delete POI (admin)
- `POST /admin/users` - Create user (admin)
- `POST /admin/users/{id}/update` - Update user (admin)
- `POST /admin/users/{id}/delete` - Delete user (admin)

## Quick Reference

| Method | Endpoint             | Auth | Description             |
| ------ | -------------------- | ---- | ----------------------- |
| POST   | `/api/users`         | ❌   | Register new user       |
| POST   | `/api/users/login`   | ❌   | Login user              |
| GET    | `/api/users/me`      | ✅   | Get current user        |
| GET    | `/api/pois`          | ❌   | List all POIs           |
| GET    | `/api/pois/personal` | ✅   | Get user's POIs         |
| POST   | `/api/pois`          | ✅   | Create new POI          |
| GET    | `/api/alerts`        | ❌   | List all alerts         |
| POST   | `/api/alerts/fetch`  | ❌   | Fetch AEMET alerts      |
| GET    | `/api/notifications` | ✅   | List user notifications |

## Important Notes

### Token Duration

- JWT tokens are valid for **15 minutes**
- Use the `/api/users/refresh-token` endpoint to get a new token without logging in again

### LDAP Authentication

- All user authentication is handled through LDAP
- Users are identified by **username** (not UUID)
- Passwords are securely stored in the LDAP directory
- Admin privileges are determined by LDAP group membership

### Authentication Types

- **JWT Bearer Token**: For API endpoints (`/api/*`)
- **Session Cookie**: For admin endpoints (`/admin/*`)

### Data Schemas

All schemas are documented in Swagger UI, including:

- **User** - User account information
- **Location** - Geographic locations in the Canary Islands
- **PointOfInterest** - Points of interest with coordinates
- **Alert** - Weather alerts and warnings
- **Notification** - User notifications

### Response Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## OpenAPI Specification

The OpenAPI specification in JSON format is available at:

- **Development**: http://localhost:85/api/docs.json
- **Production**: https://canaryweather.xyz/api/docs.json

You can import this into tools like Postman, Insomnia, or any OpenAPI-compatible client.

## Testing with cURL

### Register a User

**Development:**
```bash
curl -X POST http://localhost:85/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

**Production:**
```bash
curl -X POST https://canaryweather.xyz/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### Login

**Development:**
```bash
curl -X POST http://localhost:85/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Production:**
```bash
curl -X POST https://canaryweather.xyz/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Get Current User (with token)

**Development:**
```bash
curl -X GET http://localhost:85/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Production:**
```bash
curl -X GET https://canaryweather.xyz/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Additional Resources

- [Backend Documentation](BACKEND.md)
- [Authentication Guide](AUTHENTICATION.md)
- [Database Schema](DATABASE.md)
- [Troubleshooting](TROUBLESHOOTING.md)

---

For more detailed information about the API architecture and design patterns, see the [Backend Documentation](BACKEND.md).

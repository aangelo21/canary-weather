# CanaryWeather Authentication Guide

This document explains how user authentication works in the CanaryWeather system, including login, registration, password management, and security measures.

---

## Overview

CanaryWeather uses PostgreSQL + bcrypt for credential storage and JWT tokens for authentication. The system is fully stateless (no server-side sessions), deployed entirely on Render (Static Site + Web Service + PostgreSQL).

---

## Authentication Method: JWT Tokens

### Access Token
- Short-lived (15 minutes)
- Contains user info (id, username, email, is_admin)
- Sent in `Authorization: Bearer <token>` header
- Stored in memory on the frontend

### Refresh Token
- Long-lived (7 days)
- Contains minimal payload (user id, type: 'refresh')
- Stored in localStorage on the frontend
- Used to obtain new access tokens without re-login

---

## User Registration Flow

1. User fills registration form (email, username, password, locations)
2. Frontend sends `POST /api/users`
3. Backend validates input (unique email, unique username, password strength)
4. Password is hashed with bcrypt (10 salt rounds)
5. User is created in PostgreSQL
6. Welcome email is sent
7. Access token + refresh token are generated
8. Frontend stores tokens and redirects to dashboard

---

## User Login Flow

1. User enters username and password
2. Frontend sends `POST /api/users/login`
3. Backend finds user in database by username
4. Password is verified with bcrypt
5. Access token + refresh token are generated
6. Login notification email is sent
7. Frontend stores access token in memory, refresh token in localStorage

---

## Token Refresh Flow

1. Access token expires (401 response)
2. Frontend sends `POST /api/users/refresh-token` with `{ refreshToken }` in body
3. Backend verifies refresh token is valid and not expired
4. Backend looks up user in database
5. New access token is generated and returned
6. Frontend retries the original request with new token

This happens transparently via the API interceptor in `api.js`.

---

## Logout

Logout is client-side:
1. Frontend calls `POST /api/users/logout` (informational)
2. Frontend clears access token from memory
3. Frontend removes refresh token from localStorage
4. User is redirected to login page

---

## Password Reset Flow

1. User requests reset via `POST /api/users/forgot-password` with email
2. Backend finds user in database by email
3. A reset token (1h expiry) is generated and emailed
4. User clicks link, enters new password
5. `POST /api/users/reset-password` with token + new password
6. Backend verifies token, hashes new password with bcrypt, updates database
7. User can log in with new password

---

## Protected Routes

**Public Routes** (No auth needed):
- `POST /api/users/login`
- `POST /api/users` (register)
- `POST /api/users/refresh-token`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`
- `GET /api/alerts`
- `GET /api/locations`
- `GET /api/users/municipalities`
- `GET /api/health`

**Protected Routes** (JWT required):
- `GET /api/users/me`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `POST /api/pois`, `PUT /api/pois/{id}`, `DELETE /api/pois/{id}`
- `GET /api/notifications`
- `POST /api/user-locations`, `DELETE /api/user-locations/{id}`

**Admin Routes** (JWT + is_admin required):
- `POST /api/alerts`, `PUT /api/alerts/{id}`, `DELETE /api/alerts/{id}`
- `GET /admin` (admin dashboard)
- Admin CRUD for users and POIs

---

## Security Features

### Password Storage
- Passwords hashed with bcrypt (10 salt rounds)
- Stored in PostgreSQL — never in plain text

### Token Security
- Access tokens signed with JWT_SECRET
- Short expiry (15m) limits damage if stolen
- Refresh tokens have separate `type: 'refresh'` claim

### CORS
- Backend only accepts requests from configured `FRONTEND_URL`
- Prevents unauthorized cross-origin requests

### HTTPS
- All production traffic encrypted via Render's built-in SSL

---

## Environment Variables

```
JWT_SECRET=your_jwt_secret_key
```

---

## API Endpoints

### Login
```
POST /api/users/login
Body: { "username": "user", "password": "pass" }
Response: { "user": {...}, "token": "access_token", "refreshToken": "refresh_token" }
```

### Register
```
POST /api/users
Body: { "email": "...", "username": "...", "password": "...", "location_ids": [...] }
Response: { "user": {...}, "token": "access_token", "refreshToken": "refresh_token" }
```

### Refresh Token
```
POST /api/users/refresh-token
Body: { "refreshToken": "refresh_token" }
Response: { "token": "new_access_token" }
```

### Logout
```
POST /api/users/logout
Response: { "message": "Logged out successfully" }
```

### Get Current User
```
GET /api/users/me
Headers: { "Authorization": "Bearer access_token" }
Response: { "id": "...", "username": "...", "email": "...", ... }
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | User created |
| 400 | Missing/invalid fields |
| 401 | Not authenticated / token expired |
| 403 | Invalid token / not admin |
| 409 | Email/username already exists |
| 500 | Server error |

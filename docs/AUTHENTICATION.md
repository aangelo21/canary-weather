# CanaryWeather Authentication Guide

This document explains how user authentication works in the CanaryWeather system, including login, registration, password management, and security measures.

---

## Overview

Authentication is the process of verifying who a user is. CanaryWeather uses a combination of LDAP (for user credentials) and JWT tokens (for session management) to authenticate users.

**Simple Explanation**: Authentication is like checking a person's ID card to verify they are who they claim to be.

---

## Authentication Methods

### Method 1: LDAP (User Credentials)

**What is LDAP?**

LDAP stands for Lightweight Directory Access Protocol. It is a separate system that stores and manages user login information.

**What does LDAP store?**
- Usernames
- Passwords (encrypted)
- Email addresses
- Admin status

**Why use LDAP?**
- Passwords are stored separately from application data
- More secure than storing passwords in the database
- Can manage multiple applications with one user directory
- Follows enterprise security standards

**LDAP Connection Details**:
- Server: ldap://134.209.22.118
- Base DN: dc=canaryweather,dc=xyz
- Users OU: ou=users,dc=canaryweather,dc=xyz

---

### Method 2: JWT Tokens (Session Proof)

**What is JWT?**

JWT stands for JSON Web Token. After a user logs in, they receive a token that proves they are authenticated.

**How JWT works**:
1. User logs in with username and password
2. LDAP verifies credentials
3. Server creates a JWT token
4. Token is given to user
5. User includes token in every request
6. Server verifies token is valid

**Token Contents** (encoded):
```
{
  "id": "username",
  "username": "username",
  "is_admin": false,
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Token Duration**:
- Valid for 15 minutes
- Must be refreshed after expiration
- Cannot be reused after expiration

**Token Security**:
- Tokens are signed (cannot be modified)
- Tokens contain user information
- Tokens expire automatically
- Only valid for one user

---

## User Registration Flow

### Step-by-Step Registration

**Step 1: User Fills Registration Form**
- Frontend displays registration form
- User enters: email, username, password, location preferences

**Step 2: Frontend Sends Data**
- Data sent to: POST /api/users
- Request includes: email, username, password

**Step 3: Backend Validates**
- Check if username already exists
- Check if email already exists
- Validate password strength
- Validate email format

**Step 4: Create User in LDAP**
- Backend connects to LDAP as admin
- Creates new user entry in LDAP
- Stores username and password (encrypted)

**Step 5: Create User in Database**
- Create entry in Users table
- Create location preferences in UserLocations table
- Create session in Sessions table

**Step 6: Send Welcome Email**
- Optional: Send email confirming registration
- Email includes activation link or welcome message

**Step 7: Return Success Response**
- Backend sends user data back to frontend
- Returns JWT token for immediate login
- Frontend stores token and shows dashboard

**Step 8: User is Registered**
- User can now login
- User account is active
- User can manage preferences

---

## User Login Flow

### Step-by-Step Login

**Step 1: User Opens Login Page**
- Frontend displays login form
- User can enter: username or email
- User enters: password

**Step 2: Frontend Sends Credentials**
- Data sent to: POST /api/users/login
- Request includes: username/email and password

**Step 3: Backend Receives Request**
- Backend receives login attempt
- Backend validates input (not empty, etc.)

**Step 4: Check LDAP**
- Backend connects to LDAP
- Searches for user by username or email
- Attempts to bind (login) with password
- LDAP confirms or denies credentials

**Step 5: Check Admin Status**
- If credentials valid, check user groups
- Check if user is in "admins" group
- Set is_admin flag to true or false

**Step 6: Create Session**
- Create session in database
- Set session to expire after 24 hours
- Store user info in session

**Step 7: Generate JWT Token**
- Create JWT token containing:
  - Username
  - Email
  - Admin status
  - Expiration time (15 minutes)
- Sign token with secret key

**Step 8: Return Success Response**
- Backend sends:
  - User profile information
  - JWT token
- Frontend stores token in memory or local storage

**Step 9: User is Logged In**
- Frontend shows dashboard
- User can access protected features
- Token is sent with every API request

---

## Protected Routes and Authorization

### What are Protected Routes?

Protected routes are API endpoints that require authentication. You must be logged in to access them.

**Public Routes** (No login needed):
- POST /api/users/login (login)
- POST /api/users (register)
- GET /api/alerts (view alerts)
- GET /api/locations (view cities)
- GET /api/users/municipalities (view municipalities)
- GET /api/health (health check)

**Protected Routes** (Login required):
- GET /api/users/me (view my profile)
- PUT /api/users/{id} (update profile)
- DELETE /api/users/{id} (delete account)
- POST /api/user-locations (add favorite city)
- DELETE /api/user-locations/{id} (remove favorite city)
- POST /api/pois (create POI)
- PUT /api/pois/{id} (edit POI)
- DELETE /api/pois/{id} (delete POI)
- GET /api/notifications (view notifications)

**Admin Routes** (Admin login required):
- POST /api/alerts (create alert)
- PUT /api/alerts/{id} (edit alert)
- DELETE /api/alerts/{id} (delete alert)
- POST /api/alerts/fetch (fetch external alerts)

### How Protection Works

**Step 1: User Makes Request**
- Frontend sends request to protected endpoint
- Includes JWT token in header: `Authorization: Bearer TOKEN`

**Step 2: Backend Receives Request**
- Backend checks for Authorization header
- Extracts token from header

**Step 3: Verify Token**
- Backend checks if token exists
- Backend verifies token is valid (not tampered)
- Backend checks if token is expired

**Step 4: Check Permissions**
- Backend extracts user info from token
- Checks if user is admin (for admin routes)
- Verifies user owns the resource (if applicable)

**Step 5: Process or Deny**
- If authorized: process request normally
- If not authorized: return error 401 or 403

**Step 6: Return Response**
- Backend sends response with data or error message

---

## Token Refresh

### Why Refresh Tokens?

Tokens expire after 15 minutes for security. If a token is stolen, it can only be used for 15 minutes.

**How to Refresh**:

1. When token expires, user sees error message
2. Frontend calls: POST /api/users/refresh-token
3. Backend checks if session is still valid
4. Backend creates new JWT token
5. Frontend stores new token
6. User continues working

**Automatic Refresh**:
- Frontend should automatically refresh before expiration
- Or refresh when receiving 401 error
- Should be transparent to user

---

## Logout

### Logout Process

**Step 1: User Clicks Logout**
- User clicks "Logout" button in frontend
- Frontend calls: POST /api/users/logout

**Step 2: Backend Destroys Session**
- Backend finds user's session
- Marks session as expired
- Removes session data

**Step 3: Return Success**
- Backend confirms logout
- Frontend deletes token from storage
- Frontend redirects to login page

**Step 4: User is Logged Out**
- User cannot access protected features
- User must login again to continue

---

## Password Management

### Password Reset

**Forgot Password Flow**:

**Step 1: User Clicks "Forgot Password"**
- User goes to password reset page
- User enters their email address

**Step 2: Backend Sends Reset Email**
- Backend receives email request
- Searches LDAP for user with that email
- Generates secure reset token
- Sends email with reset link

**Step 3: User Clicks Reset Link**
- User receives email
- Email contains reset link with token
- User clicks link
- Link opens password reset page

**Step 4: User Enters New Password**
- User fills password reset form
- User enters new password (twice)
- Frontend validates password strength

**Step 5: Backend Updates Password**
- User submits reset form with token
- Backend verifies reset token is valid
- Backend updates password in LDAP
- Updates timestamp in database

**Step 6: Password is Reset**
- User can now login with new password
- Old password no longer works

### Change Password

**For Logged-In Users**:

**Step 1: User Opens Settings**
- User goes to account settings
- Finds "Change Password" option

**Step 2: User Enters Passwords**
- User enters current password
- User enters new password (twice)
- Frontend validates new password

**Step 3: Backend Verifies**
- Backend checks current password against LDAP
- If correct, updates password in LDAP
- If incorrect, returns error

**Step 4: Password is Changed**
- User must login again with new password
- All sessions are invalidated

---

## Security Features

### Password Requirements

**Strong Passwords Must Have**:
- At least 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

**Examples**:
- Valid: MyPassword123!
- Invalid: password (no uppercase, numbers, special chars)
- Invalid: Pass123 (no special character)

### Session Security

**Session Timeouts**:
- Sessions expire after 24 hours of inactivity
- Logging out destroys session immediately
- Sessions are browser/device specific

**Session Storage**:
- Stored in database (not in user browser)
- Cannot be tampered with by users
- Only session ID sent to user

### Token Security

**Token Protection**:
- Tokens are cryptographically signed
- Cannot be modified without invalidating
- Expired tokens are rejected
- Tokens include user information

**Token Storage** (Best Practices):
- Store in memory (while app running)
- Or in secure HttpOnly cookies
- Never in localStorage (vulnerable to XSS)
- Never in plain text logs

### HTTPS/SSL Encryption

**All Communication Encrypted**:
- All authentication happens over HTTPS
- Passwords sent encrypted
- Tokens sent encrypted
- No plain text transmission

---

## Error Codes and Meanings

### 200 OK
- Request succeeded
- User authenticated successfully

### 201 Created
- New user created successfully
- Registration successful

### 400 Bad Request
- Missing required fields
- Invalid email format
- Password too weak
- Invalid input data

### 401 Unauthorized
- Token missing
- Token expired
- Token invalid
- Wrong password
- User not found

### 403 Forbidden
- User not admin (for admin routes)
- No permission to access resource
- Account disabled

### 409 Conflict
- Email already registered
- Username already exists
- User already in group

### 500 Server Error
- LDAP connection failed
- Database error
- Unexpected server error

---

## Two-Factor Authentication (Future Enhancement)

**Not Currently Implemented**

Future versions may include:
- SMS verification code
- Email verification code
- Authenticator app (Google Authenticator)
- Backup codes

This would add extra security layer beyond password.

---

## API Endpoints

### Registration
```
POST /api/users
Body: {
  "email": "user@example.com",
  "username": "username",
  "password": "MyPassword123!",
  "location_ids": [1, 2, 3]
}
Response: {
  "user": {...},
  "token": "JWT_TOKEN"
}
```

### Login
```
POST /api/users/login
Body: {
  "username": "username",
  "password": "MyPassword123!"
}
Response: {
  "user": {...},
  "token": "JWT_TOKEN"
}
```

### Logout
```
POST /api/users/logout
Response: {
  "message": "Logged out successfully"
}
```

### Get Current User
```
GET /api/users/me
Headers: { "Authorization": "Bearer JWT_TOKEN" }
Response: {
  "id": "username",
  "email": "user@example.com",
  "is_admin": false
}
```

### Refresh Token
```
POST /api/users/refresh-token
Response: {
  "token": "NEW_JWT_TOKEN"
}
```

### Forgot Password
```
POST /api/users/forgot-password
Body: {
  "email": "user@example.com"
}
Response: {
  "message": "Reset email sent"
}
```

### Reset Password
```
POST /api/users/reset-password
Body: {
  "token": "RESET_TOKEN",
  "newPassword": "MyNewPassword123!"
}
Response: {
  "message": "Password reset successful"
}
```

---

## Best Practices for Users

### Protecting Your Account

1. **Use Strong Passwords**
   - Don't use common words or patterns
   - Don't reuse passwords from other sites
   - Don't share password with anyone

2. **Logout on Shared Devices**
   - Always logout when using public computers
   - Don't leave browser logged in unattended

3. **Check for HTTPS**
   - Make sure URL shows https://
   - Look for lock icon in browser
   - Never login over non-HTTPS connection

4. **Keep Token Private**
   - Don't share your JWT token
   - Don't paste token in emails or messages
   - Token proves you are logged in

5. **Report Suspicious Activity**
   - If you see unfamiliar logins
   - If someone has your password
   - Contact support immediately

---

## Troubleshooting Authentication Issues

### Problem: "Invalid Credentials"

**Causes**:
- Wrong username or password
- Username/password have typos
- Account hasn't been created yet
- LDAP server is down

**Solutions**:
1. Check spelling of username and password
2. Try resetting password
3. Create new account if needed
4. Contact support if LDAP is down

---

### Problem: "Token Expired"

**Causes**:
- Been logged in for more than 15 minutes
- Made request after token expired
- Token wasn't refreshed

**Solutions**:
1. Refresh token: POST /api/users/refresh-token
2. Or login again
3. Frontend should auto-refresh before expiration

---

### Problem: "Email Already Registered"

**Causes**:
- Email already used for another account
- Registered before but forgot

**Solutions**:
1. Use different email address
2. Try logging in with that email
3. Reset password if you forgot it
4. Contact support to unregister

---

### Problem: "Not Authorized"

**Causes**:
- Not logged in
- Token missing or invalid
- Don't have permission (admin only)
- Session expired

**Solutions**:
1. Login if not logged in
2. Include token in request header
3. Refresh token if expired
4. Contact admin if permission denied

---

## Admin Authentication

### Admin Requirements

To perform admin actions (create alerts, manage users):
- Must be registered as admin user
- Admin status set in LDAP
- Token must include is_admin: true
- Must be in admin group in LDAP

### Admin Actions Require

**Create Alert**:
- Must be logged in
- Must have is_admin: true
- Must include valid JWT token

**Delete Alert**:
- Must be logged in
- Must have is_admin: true
- Alert must exist

**Manage Users**:
- Must be logged in
- Must have is_admin: true
- Cannot manage other admins (usually)

---

## Environment Variables

**Required for Authentication**:

```
LDAP_ADMIN_DN=cn=admin,dc=canaryweather,dc=xyz
LDAP_ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
```

**Never**:
- Commit these to version control
- Share with others
- Use weak secrets
- Log these values

---

## Summary

CanaryWeather authentication uses:

1. **LDAP** for storing and verifying passwords
2. **JWT Tokens** for proving you're logged in
3. **Sessions** for maintaining login state
4. **HTTPS** for encrypting all communication

**Login Process**:
1. User enters username and password
2. LDAP verifies credentials
3. Server creates JWT token
4. User receives token
5. User includes token in every request

**Security Measures**:
- Passwords stored separately in LDAP
- Tokens expire after 15 minutes
- Sessions expire after 24 hours
- All communication encrypted
- Strong password requirements

For more details about user management, see DATABASE.md.
For API endpoint details, see API_TESTING_GUIDE.md.
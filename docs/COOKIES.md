# CanaryWeather Cookies Documentation

This document explains how cookies are used in CanaryWeather for maintaining user sessions and storing user preferences.

---

## Overview

Cookies are small files stored on the user's computer by the web browser. They contain information that helps identify the user and maintain their login state across page refreshes and browser sessions.

**Simple Explanation**: A cookie is like a ticket that proves you bought something. The store gives you a ticket, you keep it, and when you come back, you show the ticket to prove you already paid.

---

## What Are Cookies?

### Cookie Basics

A cookie is a small piece of data:
- Stored on user's computer (in browser)
- Sent automatically with every request to the server
- Can contain user information or preferences
- Has an expiration date (when it expires and is deleted)

### Cookie Structure

```
Name: session_id
Value: abc123def456xyz789
Domain: canaryweather.xyz
Path: /
Expires: 2024-01-22 10:30:00
Secure: Yes (HTTPS only)
HttpOnly: Yes (cannot be accessed by JavaScript)
SameSite: Strict
```

### Cookie Size Limits

- Single cookie: Maximum 4 kilobytes (4000 characters)
- Per domain: Usually 50-180 cookies maximum
- CanaryWeather uses only essential cookies (minimal storage)

---

## Types of Cookies Used in CanaryWeather

### 1. Session Cookie

**Purpose**: Maintain user login state

**Details**:
- Name: `connect.sid` (or similar)
- Contains: Session ID
- Expires: When browser closes (or 24 hours of inactivity)
- Secure: Yes (HTTPS only)
- HttpOnly: Yes (cannot be accessed by JavaScript)

**What it stores**:
- Session identifier
- Links to server-side session data
- Does NOT contain password or sensitive data

**How it works**:
1. User logs in
2. Server creates session
3. Server sends session ID in cookie
4. Browser stores cookie
5. Browser sends cookie with every request
6. Server looks up session and verifies user
7. When user logs out, cookie is deleted

---

### 2. Preference Cookies

**Purpose**: Store user preferences and settings

**Examples**:
- Language preference (English, Spanish, etc.)
- Theme preference (Light mode, Dark mode)
- Last viewed page
- Default location for alerts

**Details**:
- Name: Various (language, theme, etc.)
- Expires: Much later (months or years)
- Secure: Yes (HTTPS only)
- HttpOnly: No (can be accessed by JavaScript)

**Why non-HttpOnly**:
- Frontend needs to read preferences
- No sensitive data stored
- Helps improve user experience

---

### 3. Tracking Cookies (Optional)

**Purpose**: Understand how users use the application

**Examples**:
- Google Analytics cookie
- Matomo analytics cookie
- Custom usage tracking

**Details**:
- Name: Depends on service
- Expires: After specified period (usually months)
- Secure: Yes (HTTPS only)
- Purpose: Usage statistics and improvement

**Privacy Note**:
- Users can disable these in privacy settings
- Not required for basic functionality
- Can be configured or disabled

---

## How Cookies Work in CanaryWeather

### Cookie Flow During Login

```
Step 1: User Submits Login Form
  |
  v
Step 2: Frontend sends username and password to backend
  |
  v
Step 3: Backend validates with LDAP
  |
  v
Step 4: Backend creates session in database
  |
  v
Step 5: Backend creates session cookie
  Set-Cookie: connect.sid=abc123def456; 
  Path=/; 
  HttpOnly; 
  Secure; 
  SameSite=Strict; 
  Expires=2024-01-22
  |
  v
Step 6: Backend sends response to frontend
  |
  v
Step 7: Browser receives response
  |
  v
Step 8: Browser stores cookie locally
  |
  v
Step 9: User sees dashboard (logged in)
```

### Cookie Flow During Requests

```
Step 1: User makes request to backend
  GET /api/alerts
  |
  v
Step 2: Browser automatically includes cookie
  GET /api/alerts
  Cookie: connect.sid=abc123def456
  |
  v
Step 3: Backend receives request
  |
  v
Step 4: Backend extracts session ID from cookie
  |
  v
Step 5: Backend looks up session in database
  |
  v
Step 6: Backend verifies session is valid
  |
  v
Step 7: Backend checks if session is expired
  |
  v
Step 8: Backend processes request (if authorized)
  |
  v
Step 9: Backend sends response
```

### Cookie Flow During Logout

```
Step 1: User clicks Logout button
  |
  v
Step 2: Frontend calls logout endpoint
  POST /api/users/logout
  |
  v
Step 3: Backend receives logout request
  |
  v
Step 4: Backend destroys session in database
  |
  v
Step 5: Backend sends response with Set-Cookie header
  Set-Cookie: connect.sid=; 
  Max-Age=0; 
  Expires=Thu, 01 Jan 1970
  |
  v
Step 6: Browser receives response
  |
  v
Step 7: Browser deletes the cookie
  |
  v
Step 8: User is logged out
```

---

## Cookie Settings in CanaryWeather

### Session Cookie Configuration

**Settings**:
```javascript
session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only
    httpOnly: true,      // Cannot be accessed by JavaScript
    maxAge: 24*60*60*1000, // 24 hours in milliseconds
    sameSite: 'strict'   // Only send with same-site requests
  }
})
```

**Explanation**:
- `secure: true`: Only sent over HTTPS (encrypted)
- `httpOnly: true`: JavaScript cannot access (prevents XSS theft)
- `maxAge`: Cookie expires after 24 hours of inactivity
- `sameSite: 'strict'`: Only sent in same-site requests (prevents CSRF)

### Why These Settings?

**Security Benefits**:
- HTTPS encryption prevents interception
- HttpOnly prevents JavaScript theft
- Expiration limits damage if stolen
- SameSite prevents cross-site attacks

---

## Cookie Lifecycle

### Creation

When user logs in:
1. Server creates session
2. Server generates session ID
3. Server sends session ID in cookie
4. Browser stores cookie

### Usage

Every request while logged in:
1. Browser automatically sends cookie
2. Server reads session ID from cookie
3. Server verifies session is valid
4. Server processes request
5. Server sends response

### Expiration

After 24 hours or logout:
1. Cookie reaches expiration time
2. Browser automatically deletes cookie
3. Or server explicitly deletes cookie
4. Browser no longer sends cookie with requests
5. User is logged out

---

## Cookie Privacy and Consent

### Privacy Considerations

**Data in Cookies**:
- CanaryWeather cookies do NOT store:
  - Passwords (stored in LDAP)
  - Email addresses
  - Personal information
  - Location data (stored in database)

**What is stored**:
- Session ID (just an identifier)
- User preferences (theme, language)
- Analytics data (optional)

### User Consent

**GDPR/Privacy Compliance**:
- Users should be informed about cookies
- Non-essential cookies require explicit consent
- Essential cookies (login) do not need consent
- Users can disable non-essential cookies

**Cookie Banner** (if implemented):
- Explains what cookies are used
- Allows users to accept or reject
- Saves preference in cookie

---

## Common Cookie Issues

### Problem: "Cookie Not Set"

**Causes**:
- Not using HTTPS (secure cookies rejected over HTTP)
- Browser security settings too strict
- Cookie domain mismatch
- Browser is in private/incognito mode

**Solutions**:
1. Ensure using HTTPS (canaryweather.xyz, not IP)
2. Check browser privacy settings
3. Check
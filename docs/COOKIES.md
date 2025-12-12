# Cookies

This document explains how cookies are used in the CanaryWeather project.

## Overview

CanaryWeather uses cookies primarily for **session management**. While the API uses JWT (JSON Web Tokens) stored in `localStorage` for most client-side authentication, cookies are used to maintain stateful sessions, particularly for administrative functions and server-side session persistence.

## Cookie Types

### Session Cookie

The main cookie used is the standard Express session cookie.

-   **Name**: `connect.sid` (Default for express-session)
-   **Purpose**: Identifies the user's session on the server.
-   **Content**: A signed session ID.
-   **Storage**: The session data itself is stored in the PostgreSQL database using `connect-session-sequelize`. The cookie only contains the ID.

## Configuration

The cookie configuration is defined in `backend/index.js`.

```javascript
// backend/index.js
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS (Production)
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

## Security Features

The session cookie implements several security best practices:

1.  **HttpOnly**: The `httpOnly: true` flag is set, which prevents client-side scripts (like JavaScript) from accessing the cookie. This mitigates the risk of Cross-Site Scripting (XSS) attacks.
2.  **Secure**: The `secure` flag should be set to `true` in production environments to ensure the cookie is only transmitted over HTTPS.
3.  **Signed**: The session ID is signed using the `SESSION_SECRET` to prevent tampering.

## Frontend Interaction

The frontend (Vite/React) is configured to send cookies with cross-origin requests.

```javascript
// backend/index.js
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true, // Allow cookies/headers to be sent
  })
);
```

When making requests from the frontend (e.g., using Axios), `withCredentials: true` (or equivalent configuration) ensures that the session cookie is sent to the backend.

## Troubleshooting

If you are experiencing issues with sessions:

1.  **Check CORS**: Ensure the frontend origin is listed in `ALLOWED_ORIGINS` in `backend/index.js`.
2.  **Check Credentials**: Ensure `credentials: true` is set in the backend CORS config and the frontend request.
3.  **Browser Blocking**: Check if the browser is blocking third-party cookies if the frontend and backend are on different domains.

# CanaryWeather Environment Variables

This document describes all environment variables used in the canary-weather application.

---

## Frontend

```
# API Configuration
VITE_API_BASE=http://localhost:10000/api  # In production (Render): https://your-backend.onrender.com/api

# Weather API
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

## Backend

```
# Database (Render PostgreSQL in production)
DB_HOST=your_render_db_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_PORT=5432
DB_DIALECT=postgres

# Authentication
JWT_SECRET=your_jwt_secret

# URLs
FRONTEND_URL=https://your-frontend.onrender.com
BACKEND_URL=https://your-backend.onrender.com
NODE_ENV=production

# Email Service
RESEND_API_KEY=your_resend_api_key

# Push Notifications (VAPID keys)
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your_email

# AI Configuration
GITHUB_MODELS_API_KEY=your_api_key
```

### Optional Variables

```
# Database connection pool
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Database logging
DB_LOGGING=true
```

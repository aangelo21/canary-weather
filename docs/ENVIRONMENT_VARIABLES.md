# CanaryWeather Environment Variables

This document describes all environment variables used in the Canary Weather application. These are the real variables from the project, with sensitive values redacted for security.

---

## Frontend

```
# API Configuration
VITE_API_BASE=/api

# Weather API
VITE_OPENWEATHER_API_KEY=secret_value
```

## Backend

```
# Database Configuration
DB_HOST=db-mysql-lon1-75034-do-user-27863084-0.j.db.ondigitalocean.com
DB_USER=doadmin
DB_PASSWORD=secret_value
DB_NAME=defaultdb
DB_DIALECT=mysql
DB_PORT=25060
DB_SSL=REQUIRED

# Authentication
JWT_SECRET=secret_value

# Frontend URL
FRONTEND_URL=http://localhost:5173 or htts://canaryweather.xyz
NODE_ENV=development or production

# LDAP Configuration
LDAP_ADMIN_DN=cn=admin,dc=canaryweather,dc=xyz
LDAP_ADMIN_PASSWORD=secret_value

# Email Service
RESEND_API_KEY=secret_value

#Vapid
VAPID_PUBLIC_KEY=secret_value
VAPID_PRIVATE_KEY=secret_value
VAPID_SUBJECT=mailto:admin@canaryweather.xyz

# AI Configuration
GROQ_API_KEY=secret_value
```
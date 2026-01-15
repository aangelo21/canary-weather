# CanaryWeather System Architecture

This document describes the overall structure and design of the CanaryWeather application, how different parts work together, and how data flows through the system.

---

## Overview

CanaryWeather is a full-stack web application designed to provide weather alerts and points of interest information for the Canary Islands. The system consists of three main parts:

1. Frontend (User Interface)
2. Backend (API Server)
3. Database (Data Storage)

---

## System Layers

### Layer 1: Frontend (User Interface)

**Technology**: React with Vite

The frontend is the visual part of the application that users interact with. It runs in the web browser.

**Responsibilities**:
- Display weather information
- Show weather alerts
- Display points of interest on maps
- Allow users to manage their profile
- Provide user login and registration

**How it works**:
1. Users open the application in their browser
2. The application loads from the web server
3. Users interact with the interface (click buttons, fill forms)
4. Frontend sends requests to the backend API
5. Backend responds with data
6. Frontend displays the data to users

**Location**: `frontend/` directory

---

### Layer 2: Backend (API Server)

**Technology**: Node.js with Express

The backend is the server that processes requests and manages the business logic.

**Responsibilities**:
- Handle user authentication and authorization
- Manage user accounts and profiles
- Store and retrieve weather alerts
- Manage points of interest
- Send notifications to users
- Connect to the database
- Connect to LDAP for user management

**How it works**:
1. Frontend sends an HTTP request to the backend
2. Backend receives the request
3. Backend processes the request (check permissions, validate data)
4. Backend queries the database or LDAP
5. Backend sends response back to frontend

**Main Components**:

**Routes**: Define which URLs the API responds to
- `userRoutes.js`: Handle user login, registration, profile
- `alertRoutes.js`: Handle weather alerts
- `pointOfInterestRoutes.js`: Handle special places
- `notificationRoutes.js`: Handle notifications
- `locationRoutes.js`: Handle cities/municipalities

**Controllers**: Process the business logic
- `userController.js`: User-related operations
- `alertController.js`: Alert-related operations
- `pointOfInterestController.js`: POI-related operations
- `notificationController.js`: Notification operations

**Models**: Define the structure of data
- Represent tables in the database
- Define relationships between data

**Services**: Handle special operations
- `ldapService.js`: User authentication via LDAP
- `websocketService.js`: Real-time communication
- `alertScheduler.js`: Automatic alert management
- `emailService.js`: Send emails to users

**Location**: `backend/` directory

---

### Layer 3: Database

**Technology**: MySQL

The database stores all the application data.

**What it stores**:
- User accounts (linked to LDAP)
- User preferences (which cities to monitor)
- Weather alerts
- Points of interest
- Notifications
- User sessions

**How it relates to other parts**:
- Frontend never talks directly to the database
- Only the backend can access the database
- This keeps data secure

**Location**: Cloud-hosted MySQL database

---

## How the Parts Work Together

### Example 1: User Login

```
1. User enters username and password in frontend
2. Frontend sends request to: POST /api/users/login
3. Backend receives request
4. Backend checks LDAP (user authentication system)
5. If valid, backend creates JWT token and session
6. Backend responds with user data and token
7. Frontend stores token and shows dashboard
8. User is now logged in
```

### Example 2: Viewing Weather Alerts

```
1. User clicks "View Alerts" button in frontend
2. Frontend sends request to: GET /api/alerts
3. Backend receives request
4. Backend checks if user is authenticated (has valid token)
5. Backend queries database for all alerts
6. Backend responds with alert data
7. Frontend displays alerts on the screen
8. User can see all weather warnings
```

### Example 3: Creating a Weather Alert

```
1. Admin user fills form with alert details
2. Frontend sends request to: POST /api/alerts (with alert data)
3. Backend receives request
4. Backend checks if user is admin
5. Backend validates the data
6. Backend saves alert to database
7. Backend notifies all affected users
8. Frontend shows success message
9. Users receive notifications about new alert
```

---

## Authentication and Authorization

### Authentication (Who are you?)

**LDAP System**: Checks if username and password are correct

- LDAP is a separate system that stores user credentials
- Backend checks credentials with LDAP
- If credentials are valid, LDAP confirms
- Backend creates a JWT token

### JWT Token (Proof of Identity)

After login, users receive a token that proves they are logged in.

**How it works**:
- Token contains user information (encrypted)
- Token expires after 15 minutes
- Token must be included in every request to protected endpoints
- Backend verifies token is real and not expired

### Authorization (What can you do?)

After authentication, the system checks what the user is allowed to do.

**Permission Levels**:
- Regular User: Can view alerts, create personal POIs, manage profile
- Admin User: Can create/edit/delete official alerts and manage system

**How it works**:
- Token includes `is_admin` flag
- Backend checks this flag before allowing admin operations
- If user is not admin, request is denied

---

## Architecture Diagram

### Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Web Browser (Frontend - React + Vite)                           │  │
│  │  - User Interface                                                │  │
│  │  - Client-side validation                                        │  │
│  │  - Local storage management                                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS (SSL/TLS)
                               │ DNS: canaryweather.xyz
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Nginx                                                           │  │
│  │  - SSL/TLS termination                                          │  │
│  │  - Request routing                                              │  │
│  │  - Static file serving                                          │  │
│  │  - Load balancing                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        Static Files                  API Requests
        (HTML/CSS/JS)                 /api/* routes
                                              │
┌─────────────────────────────────────────────┼─────────────────────────┐
│                      APPLICATION LAYER      │                         │
│  ┌──────────────────────────────────────────▼──────────────────────┐ │
│  │  Backend Server (Node.js + Express)                            │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │  REST API Endpoints                                     │  │ │
│  │  │  - GET/POST/PUT/DELETE operations                       │  │ │
│  │  │  - JSON request/response                                │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │  Authentication & Authorization                         │  │ │
│  │  │  - Session management (express-session)                 │  │ │
│  │  │  - Cookie management (secure, httpOnly)                 │  │ │
│  │  │  - JWT tokens (Bearer authentication)                   │  │ │
│  │  │  - Passport.js strategies                               │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │  WebSocket Server (Socket.IO)                           │  │ │
│  │  │  - Real-time bidirectional communication                │  │ │
│  │  │  - Push notifications                                   │  │ │
│  │  │  - Live alert updates                                   │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │  Controllers (Business Logic)                           │  │ │
│  │  │  - User management                                      │  │ │
│  │  │  - Alert processing                                     │  │ │
│  │  │  - Notification handling                                │  │ │
│  │  │  - POI management                                       │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │  Services Layer                                         │  │ │
│  │  │  - External API integration                             │  │ │
│  │  │  - Email service                                        │  │ │
│  │  │  - Push notification service                            │  │ │
│  │  │  - Alert scheduler (cron jobs)                          │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                │                │                │
    ┌───────────┘                │                └───────────┐
    │                            │                            │
    ▼                            ▼                            ▼
┌─────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  LDAP Server    │  │   MySQL Database     │  │   External APIs      │
│                 │  │                      │  │                      │
│ - User auth     │  │ ┌──────────────────┐ │  │ - Weather API (AEMET)│
│ - User mgmt     │  │ │ Data Access      │ │  │ - Geocoding API      │
│ - Password      │  │ │ Layer (Sequelize)│ │  │ - Map services       │
│   verification  │  │ └──────────────────┘ │  │                      │
│                 │  │                      │  │                      │
│ Directory tree: │  │ Tables:              │  │ HTTP/HTTPS requests  │
│ - ou=users      │  │ - Users              │  │ JSON responses       │
│ - ou=groups     │  │ - UserProfiles       │  │                      │
│ - ou=admins     │  │ - Sessions           │  │                      │
│                 │  │ - Locations          │  │                      │
│                 │  │ - Alerts/Warnings    │  │                      │
│                 │  │ - PointsOfInterest   │  │                      │
│                 │  │ - Forecasts          │  │                      │
│                 │  │ - Notifications      │  │                      │
│                 │  │ - UserLocations      │  │                      │
│                 │  │ - PushSubscriptions  │  │                      │
│                 │  │                      │  │                      │
│                 │  │ ORM: Sequelize       │  │                      │
│                 │  │ - Models & Relations │  │                      │
│                 │  │ - Migrations         │  │                      │
│                 │  │ - Transactions       │  │                      │
└─────────────────┘  └──────────────────────┘  └──────────────────────┘

Legend:
─────  Data/Request flow
┌───┐  Component/System boundary
│   │  Functional module
```

### Communication Protocols

**Frontend ↔ Backend:**
- REST API: HTTP/HTTPS with JSON payloads
- WebSocket: Real-time bidirectional communication (Socket.IO)
- Authentication: JWT tokens in Authorization header + Session cookies

**Backend ↔ Database:**
- Protocol: MySQL protocol
- ORM: Sequelize (abstraction layer)
- Connection pooling for performance

**Backend ↔ LDAP:**
- Protocol: LDAP protocol
- Operations: Bind, Search, Add, Modify, Delete
- Authentication: Admin credentials

**Backend ↔ External APIs:**
- Protocol: HTTP/HTTPS
- Format: JSON/XML
- Authentication: API keys

### Session and Cookie Management

```
Login Flow with Sessions & Cookies:
1. User submits credentials → Backend
2. Backend validates with LDAP
3. Backend creates session in database
4. Backend generates JWT token
5. Backend sets secure HTTP-only cookie with session ID
6. Backend returns JWT token in response body
7. Frontend stores JWT in memory/localStorage
8. Subsequent requests include:
   - JWT token in Authorization header
   - Session cookie automatically sent by browser
9. Backend validates both JWT and session
10. Session expires after 24h of inactivity
11. JWT expires after 15 minutes (requires refresh)
```

### WebSocket Real-time Communication

```
WebSocket Connection Flow:
1. Frontend establishes WebSocket connection
2. Backend authenticates connection using JWT
3. Backend stores connection reference
4. When event occurs (new alert, notification):
   - Backend emits event to connected clients
   - Specific users or broadcast to all
5. Frontend receives event instantly
6. Frontend updates UI without page reload
7. Connection persists until logout/disconnect
```

---

## Data Flow Diagram

```
User (Browser)
    |
    | HTTPS Requests (DNS: canaryweather.xyz)
    | (JWT Token + Session Cookies)
    v
Nginx (Reverse Proxy)
    |
    | Forwards requests
    | SSL/TLS termination
    v
Frontend Application (React + Vite)
    |
    | REST API Calls (HTTP/JSON)
    | WebSocket connection (Socket.IO)
    v
Backend API (Node.js + Express)
    |
    +---> LDAP Server
    |     (User Authentication & Management)
    |     - Bind operations
    |     - User search & validation
    |
    +---> MySQL Database
    |     (Data Persistence via Sequelize ORM)
    |     - User preferences & profiles
    |     - Alerts & forecasts
    |     - Sessions & notifications
    |     - POIs & locations
    |
    +---> External APIs
    |     (Weather data, geocoding, maps)
    |     - AEMET weather API
    |     - Geocoding services
    |
    +---> WebSocket (Socket.IO)
          (Real-time bidirectional communication)
          - Push notifications to clients
          - Live alert updates
          - Real-time data synchronization
```

---

## Communication Between Components

### Frontend to Backend

**HTTP Requests** (REST API):
- Request type: GET, POST, PUT, DELETE
- Contains URL path and data
- Includes authentication token
- Backend responds with JSON data

**WebSocket** (Real-time):
- Direct connection between frontend and backend
- Used for instant notifications
- Updates happen immediately (no need to refresh)

### Backend to Database

**SQL Queries**:
- SELECT: Get data from database
- INSERT: Add new data
- UPDATE: Modify existing data
- DELETE: Remove data

### Backend to LDAP

**LDAP Operations**:
- Bind: Connect as admin
- Search: Find users
- Modify: Update user information
- Add: Create new user
- Delete: Remove user

---

## Key Technologies

### Frontend Stack
- React: JavaScript library for user interface
- Vite: Build tool for fast development
- JavaScript: Programming language
- HTML/CSS: For layout and styling

### Backend Stack
- Node.js: JavaScript runtime on server
- Express: Web framework for routing and handling requests
- Sequelize: Tool for database operations
- Socket.IO: Library for WebSocket communication
- LDAP Client: Tool to communicate with LDAP server

### Database Stack
- MySQL: Relational database management system
- Sequelize ORM: Maps database tables to JavaScript objects

### Infrastructure
- Nginx: Web server and reverse proxy
- PM2: Process manager (keeps applications running)
- DigitalOcean: Cloud hosting provider
- Let's Encrypt: Provides free SSL certificates for HTTPS

---

## System Flows

### User Registration Flow

```
User fills registration form
        |
        v
Frontend sends registration data
        |
        v
Backend receives request
        |
        v
Backend checks if username/email exists
        |
        v (if doesn't exist)
Backend creates user in LDAP
        |
        v
Backend creates user preferences in database
        |
        v
Frontend shows success message
        |
        v
User can now login
```

### Alert Creation Flow

```
Admin fills alert form
        |
        v
Frontend sends alert data
        |
        v
Backend receives request
        |
        v
Backend verifies user is admin
        |
        v (if admin)
Backend validates alert data
        |
        v
Backend saves alert to database
        |
        v
Backend finds users affected by alert
        |
        v
Backend creates notifications for those users
        |
        v
WebSocket sends real-time update to connected users
        |
        v
Users see alert immediately
```

### WebSocket Communication

```
Frontend connects to WebSocket
        |
        v
Backend establishes connection
        |
        v
When data changes:
        |
        +-- Backend detects change
        |
        +-- Backend sends update through WebSocket
        |
        v
Frontend receives update without page refresh
        |
        v
User sees new data instantly
```

---

## Security Architecture

### Password Storage
- Passwords NOT stored in our database
- Stored in LDAP (separate secure system)
- Never transmitted in plain text

### Session Management
- Sessions stored in database
- Expires after 24 hours of inactivity
- Sessions are tied to specific devices/browsers

### Token Security
- JWT tokens are signed (cannot be modified)
- Expire after 15 minutes
- Must be refreshed for continued access
- Tokens are only valid for one user

### HTTPS/SSL
- All traffic is encrypted
- Certificate from Let's Encrypt
- Automatic renewal

### Database Security
- Database not exposed to internet
- Only backend can access database
- Credentials stored in environment variables

---

## Scalability Considerations

### Current Architecture
- Single server (DigitalOcean Droplet)
- One database
- One frontend application
- One backend application

### Future Improvements
- Load balancing (multiple backend servers)
- Database replication
- Caching layer (Redis)
- Content delivery network (CDN) for static files
- Microservices (separate services for different features)

---

## Error Handling

### Frontend Errors
- Display user-friendly error messages
- Log technical details for debugging
- Automatically retry failed requests

### Backend Errors
- Validate all input data
- Return appropriate HTTP status codes
- Log errors for monitoring
- Never expose sensitive system information

### Database Errors
- Connection retry logic
- Transaction rollback on failure
- Data consistency checks

---

## Monitoring and Logging

### What Gets Logged
- User login/logout events
- API requests and responses
- Database queries
- Errors and exceptions
- System performance metrics

### Log Files
- Backend logs: `logs/backend/`
- Frontend logs: `logs/frontend/`
- System logs: `/var/log/` (server logs)
- Nginx logs: `/var/log/nginx/`

### PM2 Log Management
- Logs rotated daily
- Compressed after rotation
- Kept for 30 days
- Prevents disk space issues

---

## Development Environment vs Production

### Development
- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:85`
- Database: Local or test database
- LDAP: Test LDAP server
- No SSL/HTTPS

### Production
- Frontend runs on: `https://canaryweather.xyz`
- Backend runs on: `https://canaryweather.xyz/api`
- Database: Production database
- LDAP: Production LDAP server
- Full SSL/HTTPS encryption
- Behind Nginx reverse proxy
- Managed by PM2

---

## Summary

CanaryWeather uses a three-layer architecture:

1. Frontend: Vue.js application for user interface
2. Backend: Node.js/Express server for business logic
3. Database: MySQL for data storage

The parts communicate through:
- HTTP REST API: For normal requests
- WebSocket: For real-time updates
- SQL Queries: For database operations
- LDAP: For user authentication

This architecture provides:
- Separation of concerns (each part has clear responsibilities)
- Security (database never exposed to users)
- Scalability (parts can be expanded independently)
- Maintainability (easier to find and fix issues)

For more detailed information about specific components, see the other documentation files in this directory.
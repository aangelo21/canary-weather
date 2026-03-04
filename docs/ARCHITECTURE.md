# CanaryWeather System Architecture

This document describes the overall structure and design of the CanaryWeather application, how different parts work together, and how data flows through the system.

---

## Overview

CanaryWeather is a full-stack web application designed to provide weather alerts and points of interest information for the Canary Islands. The system is deployed entirely on Render:

1. **Frontend** (Render Static Site) — React + Vite SPA
2. **Backend** (Render Web Service) — Node.js + Express API
3. **Database** (Render PostgreSQL) — PostgreSQL

---

## System Layers

### Layer 1: Frontend (User Interface)

**Technology**: React with Vite
**Hosting**: Render Static Site

The frontend is the visual part of the application that users interact with. It runs in the web browser.

**Responsibilities**:
- Display weather information
- Show weather alerts
- Display points of interest on maps
- Allow users to manage their profile
- Provide user login and registration
- Manage JWT tokens (access + refresh)

**Location**: `frontend/` directory

---

### Layer 2: Backend (API Server)

**Technology**: Node.js with Express
**Hosting**: Render Web Service

The backend is the server that processes requests and manages the business logic.

**Responsibilities**:
- Handle user authentication with JWT + bcrypt
- Manage user accounts and profiles
- Store and retrieve weather alerts
- Manage points of interest
- Send notifications to users
- Connect to the PostgreSQL database

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
- `authService.js`: User authentication with bcrypt
- `tokenService.js`: JWT access/refresh token management
- `websocketService.js`: Real-time communication
- `alertScheduler.js`: Automatic alert management
- `emailService.js`: Send emails to users

**Location**: `backend/` directory

---

### Layer 3: Database

**Technology**: PostgreSQL (hosted on Render)

The database stores all application data including user credentials (bcrypt-hashed passwords).

**What it stores**:
- User accounts (with hashed passwords)
- User preferences (which cities to monitor)
- Weather alerts
- Points of interest
- Notifications

**Location**: Render-hosted PostgreSQL database

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Web Browser (Frontend - React + Vite)                           │  │
│  │  - User Interface                                                │  │
│  │  - Client-side validation                                        │  │
│  │  - JWT token management (access in memory, refresh in storage)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               ▼
┌──────────────────────┐              ┌──────────────────────────────────┐
│  Render              │              │  Render                          │
│  (Static Site)       │   REST API   │  (Web Service)                   │
│  - SPA serving       │──────────────│  - Node.js + Express             │
│  - CDN               │              │  - JWT authentication            │
│  - Auto SSL          │              │  - WebSocket (Socket.IO)         │
└──────────────────────┘              │  - Business logic                │
                                      └──────────────────────────────────┘
                                                     │
                                      ┌──────────────┴──────────────┐
                                      │                             │
                                      ▼                             ▼
                           ┌──────────────────┐         ┌──────────────────┐
                           │ PostgreSQL       │         │ External APIs    │
                           │ (Render)         │         │                  │
                           │                  │         │ - MeteoAlarm     │
                           │ Tables:          │         │ - OpenStreetMap  │
                           │ - Users          │         │ - AI Service     │
                           │ - Locations      │         │                  │
                           │ - Alerts         │         │                  │
                           │ - Notifications  │         │                  │
                           │ - POIs           │         │                  │
                           │ - UserLocations  │         │                  │
                           │ - UserPOIs       │         │                  │
                           └──────────────────┘         └──────────────────┘
```

---

## Authentication Flow

```
Login Flow (JWT-only, stateless):
1. User submits credentials → Backend
2. Backend validates password with bcrypt against PostgreSQL
3. Backend generates access token (15m) + refresh token (7d)
4. Frontend stores access token in memory, refresh token in localStorage
5. Subsequent requests include access token in Authorization header
6. When access token expires (401), frontend uses refresh token to get new one
7. If refresh token expired, user must log in again
```

---

## Communication Protocols

**Frontend ↔ Backend:**
- REST API: HTTPS with JSON payloads
- WebSocket: Real-time bidirectional communication (Socket.IO)
- Authentication: JWT tokens in Authorization header

**Backend ↔ Database:**
- Protocol: PostgreSQL protocol
- ORM: Sequelize (abstraction layer)
- Connection pooling for performance

**Backend ↔ External APIs:**
- Protocol: HTTPS
- Format: JSON/XML
- Authentication: API keys

---

## Development Environment vs Production

### Development
- Frontend runs on: `http://localhost:5173` (Vite dev server with proxy)
- Backend runs on: `http://localhost:10000`
- Database: Local PostgreSQL or remote

### Production
- Frontend: `https://your-app.onrender.com`
- Backend: `https://your-api.onrender.com`
- Database: Render PostgreSQL
- SSL handled automatically by Render

---

## Key Technologies

### Frontend Stack
- React: JavaScript library for user interface
- Vite: Build tool for fast development
- Render Static Site: Static hosting with CDN

### Backend Stack
- Node.js: JavaScript runtime on server
- Express: Web framework for routing and handling requests
- Sequelize: Tool for database operations
- Socket.IO: Library for WebSocket communication
- JWT + bcrypt: Authentication

### Database Stack
- PostgreSQL: Relational database management system
- Sequelize ORM: Maps database tables to JavaScript objects

### Infrastructure
- Render Static Site: Frontend hosting with auto-deploy
- Render Web Service: Backend hosting with auto-deploy
- Render PostgreSQL: Managed database

---

## Summary

CanaryWeather uses a unified cloud architecture on Render:

1. **Frontend on Render Static Site**: React SPA with auto-deploy
2. **Backend on Render Web Service**: Node.js/Express API with JWT auth
3. **Database on Render PostgreSQL**: PostgreSQL for all data

The parts communicate through:
- HTTPS REST API: For normal requests
- WebSocket: For real-time updates
- SQL Queries: For database operations

This architecture provides:
- Separation of concerns (each part has clear responsibilities)
- Unified hosting platform (all on Render)
- Auto-deploy from GitHub
- Built-in SSL/HTTPS
- Scalability (parts can be upgraded independently)

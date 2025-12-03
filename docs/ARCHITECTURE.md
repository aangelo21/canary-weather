# CanaryWeather Architecture

This document provides an overview of the CanaryWeather application architecture, design patterns, and technical decisions.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [External Integrations](#external-integrations)

## High-Level Architecture

CanaryWeather follows a **client-server architecture** with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Frontend (Vite)                     │  │
│  │  - Components  - Pages  - Services  - State      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                    HTTP/HTTPS (REST API)
                          │
┌─────────────────────────────────────────────────────────┐
│                     Server Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Express.js Backend (Node.js)                 │  │
│  │  - Routes  - Controllers  - Middleware  - Models │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                   Sequelize ORM
                          │
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │              MySQL Database                       │  │
│  │  - Users  - POIs  - Alerts  - Notifications      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                   External APIs
                          │
                  ┌───────┴───────┐
                  │               │
              Meteoalarm      OpenStreetMap
```

## Technology Stack

### Backend

- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **ORM**: Sequelize v6
- **Database**: MySQL 8.0+
- **Authentication**: JWT + Express Session
- **File Upload**: Multer
- **API Documentation**: Swagger/OpenAPI 3.0
- **Password Hashing**: bcrypt
- **External Data Parsing**: xml2js (Meteoalarm feeds)
- **Templating**: EJS (Admin Dashboard)

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Mapping**: Leaflet (via react-leaflet)
- **Routing**: React Router
- **Internationalization**: i18next
- **Styling**: Tailwind CSS

### DevOps

- **Process Manager**: PM2
- **Version Control**: Git
- **Hosting**: DigitalOcean Droplets
- **Database Hosting**: DigitalOcean Managed MySQL

## Design Patterns

### Backend Patterns

#### 1. MVC (Model-View-Controller)

The backend follows a modified MVC pattern:

- **Models**: Sequelize models define database schema
- **Controllers**: Handle business logic and request processing
- **Routes**: Define API endpoints and map to controllers
- **Views**: EJS templates for admin dashboard

#### 2. Middleware Pattern

Middleware functions handle cross-cutting concerns:

- **Authentication**: `authenticateToken`, `authenticateSession`
- **Authorization**: `checkAdmin`
- **File Upload**: `upload`, `uploadPOI`
- **Error Handling**: Centralized error handling

#### 3. Repository Pattern

Sequelize ORM acts as a repository layer, abstracting database operations.

### Frontend Patterns

#### 1. Component-Based Architecture

React components are organized by feature and reusability:

- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **Services**: API communication layer

#### 2. Service Layer

API calls are centralized in service modules:

- `userService.js`
- `poiService.js`
- `alertService.js`
- etc.

## Project Structure

### Backend Structure

```
backend/
├── config/
│   ├── database.js          # Database configuration
│   └── swagger.config.js    # Swagger/OpenAPI configuration
├── controllers/
│   ├── userController.js    # User business logic
│   ├── poiController.js     # POI business logic
│   ├── alertController.js   # Alert business logic
│   └── ...
├── middleware/
│   ├── authMiddleware.js    # Authentication middleware
│   ├── uploadMiddleware.js  # File upload middleware
│   └── checkAdmin.js        # Admin authorization
├── models/
│   ├── index.js             # Model associations
│   ├── user.js              # User model
│   ├── pointOfInterest.js   # POI model
│   └── ...
├── routes/
│   ├── userRoutes.js        # User API routes
│   ├── poiRoutes.js         # POI API routes
│   └── ...
├── migrations/              # Database migrations
├── seeders/                 # Database seeders
├── uploads/                 # Uploaded files
└── index.js                 # Application entry point
```

### Frontend Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── i18n/                # Internationalization
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
└── index.html               # HTML template
```

## Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT token (15min expiry)
   ↓
4. Return token + user data
   ↓
5. Frontend stores token
   ↓
6. Include token in subsequent requests
   ↓
7. Backend validates token on each request
```

### Data Fetching Flow

```
1. Component mounts
   ↓
2. Call service function (e.g., getAlerts())
   ↓
3. Service makes HTTP request with Axios
   ↓
4. Backend route receives request
   ↓
5. Middleware validates authentication
   ↓
6. Controller processes request
   ↓
7. Model queries database via Sequelize
   ↓
8. Data returned through layers
   ↓
9. Component updates state and renders
```

## External Integrations

### AEMET API

- **Purpose**: Weather data and alerts for Spain
- **Usage**: Fetch real-time weather forecasts and alerts
- **Authentication**: API key required
- **Endpoints Used**:
  - Weather forecasts
  - Weather alerts
  - Coastal warnings

### OpenStreetMap / Leaflet

- **Purpose**: Interactive mapping
- **Usage**: Display POIs and weather data on map
- **No authentication required**

## Security Architecture

### Authentication Layers

1. **JWT Tokens** (API endpoints)

   - Short-lived (15 minutes)
   - Stateless
   - Bearer token in Authorization header

2. **Express Sessions** (Admin dashboard)
   - Server-side session storage
   - Cookie-based
   - Longer duration (24 hours)

### Authorization Levels

- **Public**: No authentication required
- **Authenticated**: Valid JWT token required
- **Admin**: Session authentication + admin flag

### Data Protection

- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection**: Sequelize parameterized queries
- **XSS Protection**: React's built-in escaping
- **CORS**: Configured for specific origins

## Database Architecture

### Entity Relationships

```
User ──┬── UserLocation ── Location
       ├── UserPOI ── PointOfInterest ── Forecast
       └── Notification ── Alert
```

### Key Tables

- **Users**: User accounts and authentication
- **Locations**: Geographic locations (municipalities)
- **PointsOfInterest**: User and global POIs
- **Alerts**: Weather alerts and warnings
- **Notifications**: User notifications
- **Forecasts**: Weather forecast data

For detailed schema information, see [DATABASE.md](DATABASE.md).

## Scalability Considerations

### Current Architecture

- Single server deployment
- Managed database (DigitalOcean)
- PM2 for process management

### Future Scalability

- **Horizontal Scaling**: Load balancer + multiple app servers
- **Caching**: Redis for session storage and API caching
- **CDN**: Static asset delivery
- **Database**: Read replicas for query optimization

## Performance Optimizations

1. **Database Indexing**: Indexes on frequently queried fields
2. **Eager Loading**: Sequelize includes to reduce N+1 queries
3. **Frontend Code Splitting**: Vite's automatic code splitting
4. **Image Optimization**: Compressed uploads
5. **API Response Caching**: Potential for Redis integration

## Monitoring and Logging

### Current Setup

- PM2 process monitoring
- Console logging
- Error tracking in application

### Recommended Additions

- **Application Monitoring**: PM2 Plus or New Relic
- **Log Aggregation**: Winston + Elasticsearch
- **Error Tracking**: Sentry
- **Performance Monitoring**: Application Performance Monitoring (APM)

## Deployment Architecture

```
┌─────────────────────────────────────┐
│     DigitalOcean Droplet            │
│  ┌──────────────────────────────┐  │
│  │  PM2 Process Manager          │  │
│  │  ├── Frontend (Vite dev)      │  │
│  │  └── Backend (Node.js)        │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              ├── Port 85 (Backend API)
              └── Port 5173 (Frontend)

┌─────────────────────────────────────┐
│  DigitalOcean Managed MySQL         │
│  - Automated backups                │
│  - High availability                │
└─────────────────────────────────────┘
```

For deployment details, see [deployment.md](deployment.md).

## Development Workflow

1. **Local Development**: npm run dev (both frontend and backend)
2. **Database Migrations**: Sequelize CLI
3. **API Testing**: Swagger UI at /api-docs
4. **Version Control**: Git with feature branches
5. **Code Review**: Pull requests on GitHub

## Future Architecture Improvements

1. **Microservices**: Separate weather service, notification service
2. **Message Queue**: RabbitMQ or Redis for async tasks
3. **WebSockets**: Real-time weather updates
4. **GraphQL**: Alternative to REST API
5. **Docker**: Containerization for easier deployment
6. **CI/CD**: Automated testing and deployment pipeline

---

For more detailed information on specific components:

- [Database Schema](DATABASE.md)
- [Authentication System](AUTHENTICATION.md)
- [Backend API](BACKEND.md)
- [Frontend Components](FRONTEND.md)

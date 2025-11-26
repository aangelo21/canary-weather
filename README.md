# CanaryWeather 🌤️

![CanaryWeather Banner](frontend/public/logo.webp)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](license)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](contributing.md)

> A comprehensive weather application providing real-time forecasts, alerts, and points of interest for the Canary Islands.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## 🌟 Overview

CanaryWeather is a full-stack web application designed specifically for the Canary Islands, providing comprehensive weather information, coastal alerts, tide predictions, and a community-driven platform for discovering and sharing points of interest across the archipelago.

The application integrates with AEMET (Spanish Meteorological Agency) API to provide accurate, real-time weather data tailored to the unique microclimates of the Canary Islands.

## ✨ Features

### Weather & Alerts

- 🌡️ **Real-time Weather Forecasts** - Detailed predictions for all Canary Islands locations
- 🌊 **Tide Information** - Accurate tide tables and predictions for coastal areas
- ⚠️ **Weather Alerts** - Real-time notifications for severe weather conditions
- 📊 **Historical Data** - Access to past weather patterns and trends

### User Features

- 👤 **User Management** - Secure registration and authentication with JWT
- ⭐ **Favorite Locations** - Save and manage your preferred locations
- 📍 **Personal POIs** - Create and share custom points of interest
- 🔔 **Notifications** - Receive alerts for your saved locations
- 🖼️ **Profile Customization** - Upload profile pictures and personalize your account

### Interactive Experience

- 🗺️ **Interactive Map** - Visualize weather data and POIs using Leaflet
- 🔍 **Location Search** - Find weather information for any municipality
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🌐 **Multilingual Support** - Available in multiple languages

### Admin Features

- 🛠️ **Admin Dashboard** - Manage users and global points of interest
- 📝 **Content Management** - Create and moderate community content
- 📈 **Analytics** - Monitor application usage and performance

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v5
- **ORM**: Sequelize v6
- **Authentication**: JWT (JSON Web Tokens) + Express Session
- **File Upload**: Multer v2
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger/OpenAPI 3.0
- **Database**: MySQL 8.0+

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Mapping**: Leaflet
- **HTTP Client**: Axios
- **Routing**: React Router
- **Styling**: CSS3
- **Internationalization**: i18next

### DevOps & Deployment

- **Process Manager**: PM2
- **Version Control**: Git
- **Hosting**: DigitalOcean
- **Database Hosting**: DigitalOcean Managed MySQL

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **MySQL** v8.0 or higher ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

### Clone the Repository

```bash
git clone https://github.com/aangelo21/canary_weather.git
cd canary_weather
```

### Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=canary_weather
DB_DIALECT=mysql
DB_PORT=3306

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret
SESSION_SECRET=your_session_secret_here

# Server Port
PORT=85

# AEMET API Key (get from https://opendata.aemet.es/)
AEMET_API_KEY=your_aemet_api_key_here
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:85
VITE_API_KEY=your_api_key_here
```

## 📦 Installation

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the MySQL database:

   ```sql
   CREATE DATABASE canary_weather;
   ```

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. (Optional) Seed the database with sample data:

   ```bash
   npm run seed:all
   ```

   Or seed specific data:

   ```bash
   npm run seed:users      # Seed sample users
   npm run seed:pois       # Seed points of interest
   npm run seed:alerts     # Seed weather alerts
   ```

6. Start the backend server:
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

The backend server will start on `http://localhost:85`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will be available at `http://localhost:5173`

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at: **http://localhost:85/api-docs**

The Swagger UI provides:

- Complete endpoint documentation
- Request/response schemas
- Interactive API testing
- JWT authentication support

### Quick API Reference

**Authentication**

- `POST /api/users` - Register new user
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout
- `POST /api/users/refresh-token` - Refresh JWT token

**Users**

- `GET /api/users/me` - Get current user
- `GET /api/users` - List all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Points of Interest**

- `GET /api/pois` - List all POIs
- `GET /api/pois/personal` - Get user's POIs
- `POST /api/pois` - Create POI
- `PUT /api/pois/:id` - Update POI
- `DELETE /api/pois/:id` - Delete POI

**Alerts**

- `GET /api/alerts` - List all alerts
- `POST /api/alerts/fetch` - Fetch alerts from AEMET

**Notifications**

- `GET /api/notifications` - List user notifications
- `PUT /api/notifications/:id` - Mark as read

For complete API documentation, see [docs/api.md](docs/api.md)

## 📁 Project Structure

```
canary_weather/
├── backend/                 # Backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   ├── uploads/            # Uploaded files
│   └── index.js            # Entry point
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── index.html          # HTML template
├── docs/                   # Documentation
│   ├── api.md              # API documentation
│   ├── deployment.md       # Deployment guide
│   └── diagrams.md         # System diagrams
├── readme.md               # This file
├── contributing.md         # Contribution guidelines
└── license                 # License information
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](contributing.md) for details on:

- Setting up the development environment
- Code style and conventions
- Submitting pull requests
- Reporting issues

## 📄 License

This project is licensed under the MIT License - see the [license](license) file for details.

## 🚀 Deployment

For production deployment instructions, including DigitalOcean setup, PM2 configuration, and database hosting, see [docs/deployment.md](docs/deployment.md).

## 📖 Additional Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [Authentication Guide](docs/AUTHENTICATION.md)
- [Frontend Documentation](docs/FRONTEND.md)
- [Backend Documentation](docs/BACKEND.md)
- [Testing Guide](docs/TESTING.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🙏 Acknowledgements

- **Samuel Ponce** ([@s-pl](https://github.com/s-pl)) - Project collaborator
- **AEMET** - Weather data provider
- **OpenStreetMap** - Map data
- **Leaflet** - Interactive mapping library

---

**Made with ❤️ for the Canary Islands**

# CanaryWeather 🌤️

![CanaryWeather Banner](frontend/public/logo.webp)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](license)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](contributing.md)

> A comprehensive weather application providing real-time forecasts, alerts, and points of interest for the Canary Islands.

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [📚 API Documentation](#-api-documentation)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🚀 Deployment](#-deployment)
- [📖 Additional Documentation](#-additional-documentation)
   - [API Documentation](https://github.com/aangelo21/canary_weather/blob/main/docs/API.md)
   - [Architecture Overview](https://github.com/aangelo21/canary_weather/blob/main/docs/ARCHITECTURE.md)
   - [Authentication Guide](https://github.com/aangelo21/canary_weather/blob/main/docs/AUTHENTICATION.md)
   - [Database Schema](https://github.com/aangelo21/canary_weather/blob/main/docs/DATABASE.md)
   - [Deployment Guide](https://github.com/aangelo21/canary_weather/blob/main/docs/DEPLOYMENT.md)
   - [Diagrams](https://github.com/aangelo21/canary_weather/blob/main/docs/DIAGRAMS.md)
   - [Domain Configuration](https://github.com/aangelo21/canary_weather/blob/main/docs/DOMAIN_CONFIG.md)
   - [LDAP Guide](https://github.com/aangelo21/canary_weather/blob/main/docs/LDAP.md)
   - [Packages](https://github.com/aangelo21/canary_weather/blob/main/docs/PACKAGES.md)
- [🙏 Acknowledgements](#-acknowledgements)

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

For a detailed list of all packages and dependencies, please refer to [Packages Documentation](https://github.com/aangelo21/canary_weather/blob/main/docs/PACKAGES.md).

For architecture details and technology decisions, see [Architecture Documentation](https://github.com/aangelo21/canary_weather/blob/main/docs/ARCHITECTURE.md).

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
DB_HOST=db-mysql-lon1-75034-do-user-27863084-0.j.db.ondigitalocean.com
DB_USER=doadmin
DB_PASSWORD=
DB_NAME=defaultdb
DB_DIALECT=mysql
DB_PORT=25060
DB_SSL=REQUIRED

# Authentication
JWT_SECRET=

# Frontend URL
FRONTEND_URL=canaryweather.xyz

# LDAP Configuration
LDAP_ADMIN_DN=cn=admin,dc=canaryweather,dc=xyz
LDAP_ADMIN_PASSWORD=

# Email Service
RESEND_API_KEY=
```

> **Note:** Empty fields are intentionally left blank for security reasons. Please provide your own values for `DB_PASSWORD`, `JWT_SECRET`, `LDAP_ADMIN_PASSWORD`, and `RESEND_API_KEY` in your local environment.

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_BASE=/api 

# Weather API
VITE_OPENWEATHER_API_KEY=
```

> **Note:** Empty fields are intentionally left blank for security reasons. Please provide your own value for `VITE_OPENWEATHER_API_KEY` in your local environment.

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

Interactive API documentation is available at: **http://localhost:85/api-docs**

For complete documentation including authentication, endpoints, and schemas, see the [API Documentation](https://github.com/aangelo21/canary_weather/blob/main/docs/API.md).

## 📁 Project Structure

See [Architecture Documentation](https://github.com/aangelo21/canary_weather/blob/main/docs/ARCHITECTURE.md) for detailed project structure and design patterns.

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](contributing.md) for details on:

- Setting up the development environment
- Code style and conventions
- Submitting pull requests
- Reporting issues

## 📄 License

This project is licensed under the MIT License - see the [license](license) file for details.

## 🚀 Deployment

For production deployment instructions, including DigitalOcean setup, PM2 configuration, and database hosting, see [docs/deployment.md](https://github.com/aangelo21/canary_weather/blob/main/docs/DEPLOYMENT.md).

## 📖 Additional Documentation

- [API Documentation](https://github.com/aangelo21/canary_weather/blob/main/docs/API.md)
- [Architecture Overview](https://github.com/aangelo21/canary_weather/blob/main/docs/ARCHITECTURE.md)
- [Authentication Guide](https://github.com/aangelo21/canary_weather/blob/main/docs/AUTHENTICATION.md)
- [Database Schema](https://github.com/aangelo21/canary_weather/blob/main/docs/DATABASE.md)
- [Deployment Guide](https://github.com/aangelo21/canary_weather/blob/main/docs/DEPLOYMENT.md)
- [Diagrams](https://github.com/aangelo21/canary_weather/blob/main/docs/DIAGRAMS.md)
- [Domain Configuration](https://github.com/aangelo21/canary_weather/blob/main/docs/DOMAIN_CONFIG.md)
- [LDAP Guide](https://github.com/aangelo21/canary_weather/blob/main/docs/LDAP.md)
- [Packages](https://github.com/aangelo21/canary_weather/blob/main/docs/PACKAGES.md)

## 🙏 Acknowledgements

- **Samuel Ponce** ([@s-pl](https://github.com/s-pl)) - Project collaborator
- **AEMET** - Weather data provider
- **OpenStreetMap** - Map data
- **Leaflet** - Interactive mapping library

---

**Made with ❤️ for the Canary Islands**

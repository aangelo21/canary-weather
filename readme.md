# Canary Weather

![Canary Weather Logo](frontend/public/bannerCanaryWeather.png)

## Overview

Canary Weather is a comprehensive web application designed to provide weather-related information and services specifically for the Canary Islands. It offers real-time weather forecasts, tide predictions, coastal alerts, and a platform for users to discover and share points of interest across the archipelago.

## Features

- **Weather Forecasts**: Get detailed weather predictions for various locations in the Canary Islands
- **Tide Information**: Access tide tables and predictions for coastal areas
- **Coastal Alerts**: Stay informed about weather-related alerts and warnings
- **Points of Interest**: Explore and contribute to a community-driven database of interesting locations
- **User Management**: Create accounts, save favorite locations, and manage personal points of interest
- **Interactive Map**: Visualize weather data and points of interest on an interactive map
- **Location Services**: Search and manage user-specific locations

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **Sequelize ORM** for database management
- **JWT** for authentication
- **Multer** for file uploads

### Frontend
- **React** with Vite build tool
- **Leaflet** for interactive maps
- **CSS** for styling

### Database
- Relational database with migrations and seeders

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Database (configured in backend/config/)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
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

## Usage

1. Open your browser and navigate to the frontend application (typically http://localhost:5173)
2. Register a new account or log in
3. Explore weather forecasts, tide information, and points of interest
4. Use the interactive map to visualize data
5. Contribute by adding your own points of interest

## Contributing

Please read the contributing guidelines in `contributing.md` for details on how to contribute to this project.

## License

This project is licensed under the terms specified in the `licence` file.

## Deployment

For deployment instructions, refer to `docs/deployment.md`.


# Contributing to Canary Weather

Thank you for your interest in contributing to the Canary Weather project! This document provides guidelines and steps for contributing to this weather application for the Canary Islands.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** (version 8.0 or higher)
- **Git**

## Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the [repository page](https://github.com/aangelo21/canary_weather) to create your own fork of the project.

### 2. Clone Your Fork

Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/canary_weather.git
cd canary_weather
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Set Up the Development Environment

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=canary_weather
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. Create a MySQL database named `canary_weather`.

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. (Optional) Seed the database with initial data:
   ```bash
   npm run seed:pois
   npm run seed:users
   ```

#### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 4. Start the Development Servers

#### Backend Server

From the `backend` directory:
```bash
node index.js
```

The backend server will start on `http://localhost:3000`.

#### Frontend Server

From the `frontend` directory:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173` (default Vite port).

## Making Changes

### 1. Create a Feature Branch

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names, e.g., `feature/add-weather-alerts` or `bugfix/fix-map-zoom`.

### 2. Make Your Changes

- Follow the existing code style and structure
- Write clear, concise commit messages
- Test your changes thoroughly

### 3. Run Linting (Frontend)

Before committing, run the linter to ensure code quality:

```bash
cd frontend
npm run lint
```

Fix any linting errors before proceeding.

### 4. Test Your Changes

- Test both backend and frontend functionality
- Ensure the application runs without errors
- Verify that existing features still work

### 5. Commit Your Changes

```bash
git add .
git commit -m "Add a clear description of your changes"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your branch and provide a clear description of your changes
4. Submit the pull request

## Reporting Issues

If you find a bug or have a feature request:

1. Check existing issues to avoid duplicates
2. Create a new issue with a clear title and description
3. Include steps to reproduce for bugs
4. Add screenshots or code examples if relevant

## Additional Notes

- This project uses **Sequelize** for database management
- The frontend is built with **React** and **Vite**
- Maps are powered by **Leaflet**
- Styling uses **Tailwind CSS**

Thank you for contributing to Canary Weather!</content>
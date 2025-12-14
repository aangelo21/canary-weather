# CanaryWeather Project Packages

This document lists all the packages (dependencies) installed in the Canary Weather project. It explains what each package does and why it is used.

Packages are organized by whether they are used in the frontend or backend.

---

## Frontend Packages

The frontend is built with React and Vite. These are the main packages used.

### Core Framework

- **react** (^19.0.0-rc.1): The main JavaScript library for building user interfaces. React allows developers to create interactive web pages using components and states.

- **react-dom** (^19.0.0-rc.1): The package that connects React components to the browser. It handles rendering React components to the actual HTML page.

- **react-router-dom** (^7.9.4): Enables navigation between different pages in the app without reloading the browser. Used for creating single-page applications with multiple routes.

### Styling and Design

- **tailwindcss** (^4.1.16): A utility-first CSS framework for quickly building custom designs. Tailwind provides pre-made CSS classes for styling without writing custom CSS.

- **@tailwindcss/vite** (^4.1.16): Integration plugin that makes Tailwind work smoothly with Vite (the build tool).

- **styled-components** (^6.1.19): A library for writing CSS directly in JavaScript. Allows styling to be scoped to specific components and easily manage dynamic styles.

- **@fontsource/poppins** (^5.2.7): Provides the Poppins font family for use in the application. Ensures consistent typography across all browsers.

### Internationalization (Multiple Languages)

- **i18next** (^25.6.2): A framework for managing translations and multiple languages in the app. Makes it easy to support different languages.

- **react-i18next** (^16.3.3): React integration for i18next. Allows components to easily display text in different languages.

### Maps and Location

- **leaflet** (^1.9.4): A popular JavaScript library for displaying interactive maps. Used to show weather locations and points of interest on a map.

- **react-leaflet** (^5.0.0-rc.2): React wrapper for Leaflet. Makes it easier to use Leaflet maps within React components.

### Progressive Web App (PWA)

- **vite-plugin-pwa** (^1.2.0): Enables the app to work offline and be installable on devices like a native app. Users can install the weather app on their phone or computer.

### Utilities

- **prop-types** (^15.8.1): Runtime type checking for React component properties. Helps catch bugs by verifying that components receive the correct types of data.

- **react-helmet-async** (^2.0.5): Manages the HTML document head (title, meta tags, etc.) from React components. Useful for SEO and changing page titles dynamically.

### Build Tools (Development Only)

- **vite** (^7.1.7): A fast build tool that bundles the React code for production. Vite is much faster than older tools like Webpack.

- **@vitejs/plugin-react** (^5.0.4): Official Vite plugin for React support.

- **@tailwindcss/postcss** (^4.1.16): PostCSS plugin for Tailwind CSS processing.

- **autoprefixer** (^10.4.21): Automatically adds vendor prefixes to CSS for browser compatibility.

- **postcss** (^8.5.6): Tool for transforming CSS with plugins.

- **eslint** (^9.36.0): Code quality checker that finds problems in JavaScript code before running it.

- **@eslint/js** (^9.36.0): JavaScript rules for ESLint.

- **eslint-plugin-react-hooks** (^5.2.0): ESLint rules for React hooks to prevent bugs.

- **eslint-plugin-react-refresh** (^0.4.22): ESLint rules for React Fast Refresh.

- **vite-plugin-compression** (^0.5.1): Compresses built files to reduce download size.

- **terser** (^5.44.1): JavaScript minifier that reduces code size for faster downloads.

### Testing (Development Only)

- **vitest** (^4.0.15): Fast unit testing framework similar to Jest but designed for Vite projects.

- **@testing-library/react** (^16.3.0): Tools for testing React components.

- **@testing-library/dom** (^10.4.1): Testing utilities for DOM elements.

- **@testing-library/jest-dom** (^6.9.1): Custom assertions for testing DOM elements.

- **@testing-library/user-event** (^14.6.1): Simulates user interactions like clicking and typing for tests.

- **jsdom** (^27.3.0): JavaScript implementation of the DOM for testing in Node.js.

### Type Definitions (Development Only)

- **@types/react** (^19.1.16): TypeScript type definitions for React (optional, for IDE support).

- **@types/react-dom** (^19.1.9): TypeScript type definitions for React DOM (optional, for IDE support).

### Other

- **globals** (^16.4.0): Global variable definitions for JavaScript environments.

---

## Backend Packages

The backend is built with Node.js and Express. These are the main packages used.

### Core Framework

- **express** (^5.1.0): The main web framework for Node.js. Express handles HTTP requests, routing, and responses. It is the foundation of the REST API.

### Database

- **sequelize** (^6.37.7): An ORM (Object-Relational Mapping) that provides an easier way to interact with the MySQL database. Instead of writing raw SQL, developers write JavaScript code that Sequelize converts to SQL.

- **mysql2** (^3.15.3): The driver that allows Node.js to connect to and communicate with MySQL databases.

- **sequelize-cli** (^6.6.0): Command-line tools for managing Sequelize migrations and seeders (for development).

- **connect-session-sequelize** (^8.0.2): Stores user sessions in the database using Sequelize. Sessions are used to track logged-in users.

### Authentication and Security

- **jsonwebtoken** (^9.0.2): Creates and verifies JWT tokens. JWTs are used to authenticate API requests after a user logs in.

- **bcrypt** (^6.0.0): Hashes passwords securely. Passwords are never stored in plain text; they are hashed using bcrypt.

- **express-session** (^1.18.2): Manages user sessions. Sessions track which users are logged in.

- **ldapjs** (^3.0.7): Connects to LDAP servers for user authentication. The app uses LDAP to verify usernames and passwords.

### API Documentation

- **swagger-jsdoc** (^6.2.8): Generates API documentation from JSDoc comments in code. Makes it easy to keep documentation up-to-date.

- **swagger-ui-express** (^5.0.1): Serves the interactive Swagger UI where users can test the API. Accessible at /api/docs.

### Email and Notifications

- **resend** (^6.5.2): Service for sending emails. Used to send notifications and alerts to users via email.

- **web-push** (^3.6.7): Sends push notifications to web browsers and mobile apps. Used for real-time weather alerts.

### File Handling

- **multer** (^2.0.2): Middleware for handling file uploads. Allows users to upload images (like profile pictures).

- **sharp** (^0.34.5): Image processing library. Resizes, converts, and optimizes images uploaded by users.

### AI Integration

- **groq-sdk** (^0.37.0): SDK for connecting to the Groq AI service. Used for AI-powered features like smart alerts or analysis.

### Utilities

- **cors** (^2.8.5): Enables Cross-Origin Resource Sharing. Allows the frontend (different domain) to make requests to the backend API.

- **dotenv** (^17.2.3): Loads environment variables from a .env file. Used to store secrets like API keys and database passwords.

- **ejs** (^3.1.10): Template engine for rendering HTML pages on the server. Used for email templates or server-rendered pages.

- **socket.io** (^4.8.1): Real-time communication library. Enables live updates (like real-time notifications) between server and browser.

- **xml2js** (^0.6.2): Converts XML data to JavaScript objects. Used when processing XML data from external sources.

### Development Tools

- **jest** (^30.2.0): Testing framework for writing and running unit tests on the backend.

- **supertest** (^7.1.4): HTTP testing library. Makes it easy to test API endpoints.

- **cross-env** (^10.1.0): Sets environment variables that work on Windows, Mac, and Linux. Used in npm scripts.

---

## Dependency Resolution

Both the frontend and backend use a "resolutions" section to fix security vulnerabilities in some dependencies. This ensures that even if sub-dependencies have weak versions, they are overridden with secure versions.

Common packages kept secure:

- **lodash**: Utility functions library (security patches applied).
- **jsonwebtoken**: JWT library (security patches applied).
- **express-jwt**: JWT middleware for Express (security patches applied).
- **ws**: WebSocket library (security patches applied).
- **qs**: Query string parser (security patches applied).

---

## Summary

### Frontend Focus
The frontend uses React for the interface, Tailwind for styling, Leaflet for maps, and i18next for translations. It also includes Vite for fast building and testing tools like Vitest.

### Backend Focus
The backend uses Express for the API, Sequelize for the database, JWT for authentication, LDAP for user verification, and Socket.IO for real-time updates. It also includes email and push notification services.

### Shared Purpose
Both frontend and backend have security-focused dependencies (bcrypt, jsonwebtoken) and are designed to work together as a full-stack weather application with maps, translations, alerts, and real-time notifications.

---

## How to Install Packages

To install all packages, run:

```
npm install
```

This command reads the package.json file and downloads all listed packages.

To add a new package:

```
npm install package-name
```

To update packages to newer versions:

```
npm update
```

To check for security vulnerabilities:

```
npm audit
```

To fix automatically fixable vulnerabilities:

```
npm audit fix
```

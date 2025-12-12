# 📦 Project Dependencies & Packages

This document provides a comprehensive list of third-party libraries and packages used in CanaryWeather, explaining the specific role each plays within the system architecture.

## 🔙 Backend (Node.js)

The backend is built on a Node.js environment. Below are the main dependencies defined in `backend/package.json`.

### Core & Framework
| Package | Purpose |
| :--- | :--- |
| **`express`** | Minimalist web framework used to create the RESTful API and serve static files and views. |
| **`dotenv`** | Loads environment variables from the `.env` file to manage sensitive configurations (DB credentials, API keys). |
| **`cors`** | Middleware to enable Cross-Origin Resource Sharing between the frontend (Vite) and backend. |

### Database & ORM
| Package | Purpose |
| :--- | :--- |
| **`sequelize`** | Promise-based ORM (Object-Relational Mapper). Manages models, migrations, and SQL queries abstractly. |
| **`mysql2`** | Optimized and fast MySQL driver, required for Sequelize to connect to the MySQL database. |
| **`sequelize-cli`** | Command-line tool for managing migrations, seeders, and database configuration (dev dependency). |

### Authentication & Security
| Package | Purpose |
| :--- | :--- |
| **`jsonwebtoken`** | Generation and verification of JWT tokens for stateless authentication in the API. |
| **`bcrypt`** | Library for secure password hashing before storage in the database. |
| **`express-session`** | User session management on the server, primarily used for Admin Panel access. |
| **`connect-session-sequelize`** | Adapter to store `express-session` sessions in the MySQL database instead of memory. |

### Utilities & Features
| Package | Purpose |
| :--- | :--- |
| **`multer`** | Middleware for handling `multipart/form-data`, used for image uploads (profiles and POIs). |
| **`ejs`** | Template engine used to render the Admin Panel (Server-Side Rendering). |
| **`xml2js`** | Utility for parsing XML responses, necessary for processing weather alert feeds from external sources (AEMET/Meteoalarm). |
| **`swagger-jsdoc`** | Generates OpenAPI specification based on JSDoc comments in the source code. |
| **`swagger-ui-express`** | Serves the interactive graphical interface for API documentation at `/api/docs`. |

### Development
| Package | Purpose |
| :--- | :--- |
| **`nodemon`** | Utility that automatically restarts the Node.js server when file changes are detected. |

---

## 🎨 Frontend (React)

The frontend is a SPA (Single Page Application) built with React and Vite.

### Core & Build
| Package | Purpose |
| :--- | :--- |
| **`react` / `react-dom`** | Main library for building component-based user interfaces. |
| **`vite`** | Next-generation build tool, offering a fast development server and optimized builds. |

### Navigation & Communication
| Package | Purpose |
| :--- | :--- |
| **`react-router-dom`** | Client-side routing management (navigation between pages without reload). |
| **`axios`** | Promise-based HTTP client for making requests to the backend API. |

### Interface & Styling
| Package | Purpose |
| :--- | :--- |
| **`tailwindcss`** | Utility-first CSS framework for rapid and responsive interface design. |
| **`postcss` / `autoprefixer`** | Tools for processing CSS and automatically adding browser prefixes. |
| **`leaflet`** | Leading open-source library for mobile-friendly interactive maps. |
| **`react-leaflet`** | React components for integrating Leaflet declaratively. |

### Internationalization (i18n)
| Package | Purpose |
| :--- | :--- |
| **`i18next`** | Internationalization framework for JavaScript. |
| **`react-i18next`** | React bindings for i18next, allowing component translation using hooks like `useTranslation`. |

### Code Quality
| Package | Purpose |
| :--- | :--- |
| **`eslint`** | Linter for identifying and reporting patterns in JavaScript/React code. |
| **`eslint-plugin-react`** | React-specific linting rules. |

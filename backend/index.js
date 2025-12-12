import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
dotenv.config({ path: path.join(_dirname, '.env') });

// Import necessary modules for the Express server
import express from "express";
import cors from "cors";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
// Import Sequelize instance for database connection
import sequelize from "./controllers/dbController.js";
// Import models to ensure they are registered with Sequelize
import "./models/index.js";
import http from "http";

import pointOfInterestRoutes from "./routes/pointOfInterestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userLocationRoutes from "./routes/userLocationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";

// Import Swagger for API documentation
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.config.js";
import swaggerSpecProd from "./config/swagger.config.prod.js";
// Import websocket initializer. This module will encapsulate all Socket.IO logic.
import initWebsocket from "./services/websocketService.js";
import { startAlertScheduler } from "./services/alertScheduler.js";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an Express application instance
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set the port from environment variable or default to 85
const PORT = process.env.PORT || 85;

const isProduction = process.env.NODE_ENV === 'production' || (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('canaryweather.xyz'));
const isDevelopment = !isProduction;

// Define allowed origins for CORS (Cross-Origin Resource Sharing)
// This list should match the one used in the WebSocket service.
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://134.209.22.118:5173",
  "https://canaryweather.xyz",
];

// Enable CORS for cross-origin requests
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true, // Allow cookies/headers to be sent
  })
);
// Parse incoming JSON payloads
app.use(express.json());
// Parse incoming URL-encoded payloads (for forms)
app.use(express.urlencoded({ extended: true }));

// Configure session store
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Sessions",
});

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Serve static files from the uploads directory for profile pictures and POI images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger API Documentation - Route based on environment
app.use(
  "/api-docs",
  isDevelopment 
    ? swaggerUi.serveFiles(swaggerSpec, {})
    : swaggerUi.serveFiles(swaggerSpecProd, {}),
  isDevelopment
    ? swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "CanaryWeather API Docs - Development",
        customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
        customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css"
      })
    : swaggerUi.setup(swaggerSpecProd, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "CanaryWeather API Docs - Production",
        customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
        customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css"
      })
);

// Swagger API Documentation - Production (read-only)
app.use(
  "/api-docs-prod",
  swaggerUi.serveFiles(swaggerSpecProd, {}),
  swaggerUi.setup(swaggerSpecProd, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "CanaryWeather API Docs - Production",
    customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css"
  })
);

// Serve OpenAPI JSON spec
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Serve OpenAPI JSON spec for production
app.get("/api-docs-prod.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecProd);
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/pois", pointOfInterestRoutes);

app.use("/api/users", userRoutes);

app.use("/api/alerts", alertRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/user-locations", userLocationRoutes);

app.use("/admin", adminRoutes);
app.use("/api/push", pushRoutes);

// Health check endpoint to verify server status
app.get("/api/health", (req, res) => {

  res.json({ status: "OK", message: "CanaryWeather API is running" });
});

// Asynchronous function to initialize database and start server
(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();

    // Disable foreign key checks to prevent deadlocks during sync
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Synchronize models with database (create tables if they don't exist)
    // We use migrations for schema changes, so we don't need alter: true
    await sequelize.sync();

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Sync session store
    await sessionStore.sync();

    // Create an HTTP server from the Express app so we can attach Socket.IO
    const server = http.createServer(app);

    // Initialize the websocket layer (Socket.IO) with the HTTP server
    // The `initWebsocket` function encapsulates all websocket event wiring
    initWebsocket(server);

    // Handle server errors (e.g. EACCES if port 85 is privileged)
    server.on('error', (error) => {
      console.error('Server failed to start:', error);
    });

    // Start listening on the specified port
    server.listen(PORT, () => {
      startAlertScheduler();
    });
  } catch (error) {
    // Log any errors during database connection or sync
    console.error("Unable to connect to the database:", error);
  }
})();

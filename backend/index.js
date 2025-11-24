// Import necessary modules for the Express server
import express from "express";
import cors from "cors";
import session from "express-session";
// Import Sequelize instance for database connection
import sequelize from "./controllers/dbController.js";
// Import models to ensure they are registered with Sequelize
import "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

import pointOfInterestRoutes from "./routes/pointOfInterestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userLocationRoutes from "./routes/userLocationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

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

// Enable CORS for cross-origin requests
app.use(cors({
    origin: "http://localhost:5173", // Adjust this to match your frontend URL
    credentials: true
}));
// Parse incoming JSON payloads
app.use(express.json());
// Parse incoming URL-encoded payloads (for forms)
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from the uploads directory for profile pictures and POI images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/pois", pointOfInterestRoutes);

app.use("/api/users", userRoutes);

app.use("/api/alerts", alertRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/user-locations", userLocationRoutes);

app.use("/admin", adminRoutes);

// Health check endpoint to verify server status
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "CanaryWeather API is running" });
});

// Asynchronous function to initialize database and start server
(async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Synchronize models with database (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");

        // Start the server and listen on the specified port
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        // Log any errors during database connection or sync
        console.error("Unable to connect to the database:", error);
    }
})();

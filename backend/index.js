// Import necessary modules for the Express server
import express from "express";
import cors from "cors";
// Import Sequelize instance for database connection
import sequelize from "./controllers/dbController.js";
// Import models to ensure they are registered with Sequelize
import "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

// Import route handlers for different API endpoints
import pointOfInterestRoutes from "./routes/pointOfInterestRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an Express application instance
const app = express();
// Set the port from environment variable or default to 85
const PORT = process.env.PORT || 85;

// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON payloads
app.use(express.json());

// Serve static files from the uploads directory for profile pictures and POI images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes for points of interest API
app.use("/api/pois", pointOfInterestRoutes);

// Mount routes for user-related API
app.use("/api/users", userRoutes);

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
        await sequelize.sync({ force: false });
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

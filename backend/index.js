// imports dependencies
import express from "express";
import cors from "cors";
import sequelize from "./controllers/dbController.js";
// ensure models are registered before calling sync
import "./models/index.js";

// Import controllers

import pointOfInterestRoutes from "./routes/pointOfInterestRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 85;

// Middleware
app.use(cors());
app.use(express.json());

// POI Routes
app.use("/api/pois", pointOfInterestRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Health check route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "CanaryWeather API is running" });
});

// tests the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

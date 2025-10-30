// imports dependencies
import express from "express";
import cors from "cors";
import sequelize from "./controllers/dbController.js";
// ensure models are registered before calling sync
import "./models/index.js";

// Import controllers
import {
    getAllPointsOfInterest,
    getPointOfInterestById,
    createPointOfInterest,
    updatePointOfInterest,
    deletePointOfInterest,
    getPointsByLocation,
} from "./controllers/pointOfInterestController.js";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "./controllers/userController.js";

const app = express();
const PORT = process.env.PORT || 85;

// Middleware
app.use(cors());
app.use(express.json());

// POI Routes
app.get("/api/pois", getAllPointsOfInterest);
app.get("/api/pois/:id", getPointOfInterestById);
app.post("/api/pois", createPointOfInterest);
app.put("/api/pois/:id", updatePointOfInterest);
app.delete("/api/pois/:id", deletePointOfInterest);
app.get("/api/locations/:locationId/pois", getPointsByLocation);

// User Routes
app.get("/api/users", getAllUsers);
app.get("/api/users/:id", getUserById);
app.post("/api/users", createUser);
app.put("/api/users/:id", updateUser);
app.delete("/api/users/:id", deleteUser);

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

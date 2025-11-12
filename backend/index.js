import express from "express";
import cors from "cors";
import sequelize from "./controllers/dbController.js";
import "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

import pointOfInterestRoutes from "./routes/pointOfInterestRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 85;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/pois", pointOfInterestRoutes);

app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "CanaryWeather API is running" });
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

// imports dependencies
import sequelize from "./controllers/dbController.js";

// tests the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log(
            "Connetcion has been established successfully."
        );

        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error(error);
    }
})();

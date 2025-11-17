// Import all Sequelize model classes
import User from "./user.js";
import Location from "./location.js";
import PointOfInterest from "./pointOfInterest.js";
import Forecast from "./forecast.js";
import Alert from "./alert.js";
import Tide from "./tide.js";
import CoastCode from "./coastCode.js";
import UserPointOfInterest from "./userPointOfInterest.js";
import UserLocation from "./userLocation.js";
// Import Sequelize instance for associations
import sequelize from "../controllers/dbController.js";

// Define many-to-many relationship between User and Location through UserLocation junction table
// Users can have multiple favorite locations, locations can be favorited by multiple users
User.belongsToMany(Location, {
  through: UserLocation,
  foreignKey: "user_id",
  otherKey: "location_id",
});
Location.belongsToMany(User, {
  through: UserLocation,
  foreignKey: "location_id",
  otherKey: "user_id",
});
// Define one-to-many relationships for UserLocation junction table
User.hasMany(UserLocation, { foreignKey: "user_id" });
UserLocation.belongsTo(User, { foreignKey: "user_id" });
Location.hasMany(UserLocation, { foreignKey: "location_id" });
UserLocation.belongsTo(Location, { foreignKey: "location_id" });

// Define many-to-many relationship between User and PointOfInterest through UserPointOfInterest junction table
// Users can have multiple favorite POIs, POIs can be favorited by multiple users
User.belongsToMany(PointOfInterest, {
  through: UserPointOfInterest,
  foreignKey: "user_id",
  otherKey: "point_of_interest_id",
});
PointOfInterest.belongsToMany(User, {
  through: UserPointOfInterest,
  foreignKey: "point_of_interest_id",
  otherKey: "user_id",
});
// Define one-to-many relationships for UserPointOfInterest junction table
User.hasMany(UserPointOfInterest, { foreignKey: "user_id" });
UserPointOfInterest.belongsTo(User, { foreignKey: "user_id" });
PointOfInterest.hasMany(UserPointOfInterest, {
  foreignKey: "point_of_interest_id",
});
UserPointOfInterest.belongsTo(PointOfInterest, {
  foreignKey: "point_of_interest_id",
});

// Define one-to-many relationship between Location and Forecast
// Each location can have multiple forecast entries
Location.hasMany(Forecast, { foreignKey: "location_id" });
Forecast.belongsTo(Location, { foreignKey: "location_id" });

// Define one-to-many relationship between Location and Alert
// Each location can have multiple weather alerts
Location.hasMany(Alert, { foreignKey: "location_id" });
Alert.belongsTo(Location, { foreignKey: "location_id" });

// Define one-to-many relationship between Location and Tide
// Each location can have multiple tide entries
Location.hasMany(Tide, { foreignKey: "location_id" });
Tide.belongsTo(Location, { foreignKey: "location_id" });

// Define one-to-many relationship between CoastCode and Tide
// Each coast code can have multiple tide entries
CoastCode.hasMany(Tide, { foreignKey: "coast_code_id" });
Tide.belongsTo(CoastCode, { foreignKey: "coast_code_id" });

// Define one-to-many relationship between CoastCode and Location
// Each coast code can be associated with multiple locations
Location.belongsTo(CoastCode, { foreignKey: "coast_code_id" });
CoastCode.hasMany(Location, { foreignKey: "coast_code_id" });

// Define one-to-many relationship between Location and PointOfInterest
// Each location can have multiple points of interest
PointOfInterest.belongsTo(Location, { foreignKey: "location_id" });
Location.hasMany(PointOfInterest, { foreignKey: "location_id" });

// Export Sequelize instance and all model classes for use in other parts of the application
export {
  sequelize,
  User,
  Location,
  PointOfInterest,
  Forecast,
  Alert,
  Tide,
  CoastCode,
  UserPointOfInterest,
  UserLocation,
};

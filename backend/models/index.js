import User from "./user.js";
import Location from "./location.js";
import PointOfInterest from "./pointOfInterest.js";
import Forecast from "./forecast.js";
import Alert from "./alert.js";
import Notification from "./notification.js";
import UserPointOfInterest from "./userPointOfInterest.js";
import UserLocation from "./userLocation.js";
import UserProfile from "./userProfile.js";
import sequelize from "../controllers/dbController.js";

/**
 * Database Associations
 * 
 * Defines the relationships between the Sequelize models.
 */

// Note: User associations have been removed as Users are now managed via LDAP.
// UserLocation and UserPointOfInterest now store user_id as a string (username).

// Explicit associations for the junction table UserLocation
// UserLocation.belongsTo(User) is removed.
Location.hasMany(UserLocation, { foreignKey: "location_id" });
UserLocation.belongsTo(Location, { foreignKey: "location_id" });

// Explicit associations for the junction table UserPointOfInterest
// UserPointOfInterest.belongsTo(User) is removed.
PointOfInterest.hasMany(UserPointOfInterest, {
  foreignKey: "point_of_interest_id",
});
UserPointOfInterest.belongsTo(PointOfInterest, {
  foreignKey: "point_of_interest_id",
});

// PointOfInterest <-> Forecast (One-to-Many)
// A POI can have multiple forecast entries (e.g., for different times).
PointOfInterest.hasMany(Forecast, { foreignKey: "poi_id" });
Forecast.belongsTo(PointOfInterest, { foreignKey: "poi_id" });

// Location <-> Alert (One-to-Many)
// A Location can have multiple active or past alerts.
Location.hasMany(Alert, { foreignKey: "location_id", onDelete: 'CASCADE' });
Alert.belongsTo(Location, { foreignKey: "location_id", onDelete: 'CASCADE' });

// Alert <-> Notification (One-to-Many)
// An Alert can trigger multiple notifications (e.g., to different users).
Alert.hasMany(Notification, { foreignKey: "alert_id" });
Notification.belongsTo(Alert, { foreignKey: "alert_id" });

// User <-> Notification (One-to-Many)
// User association removed.

export {
  sequelize,
  User,
  Location,
  PointOfInterest,
  Forecast,
  Alert,
  Notification,
  UserPointOfInterest,
  UserLocation,
  UserProfile,
};

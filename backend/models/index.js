import User from "./user.js";
import Location from "./location.js";
import PointOfInterest from "./pointOfInterest.js";
import Forecast from "./forecast.js";
import Alert from "./alert.js";
import Notification from "./notification.js";
import UserPointOfInterest from "./userPointOfInterest.js";
import UserLocation from "./userLocation.js";
import sequelize from "../controllers/dbController.js";

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
User.hasMany(UserLocation, { foreignKey: "user_id" });
UserLocation.belongsTo(User, { foreignKey: "user_id" });
Location.hasMany(UserLocation, { foreignKey: "location_id" });
UserLocation.belongsTo(Location, { foreignKey: "location_id" });

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
User.hasMany(UserPointOfInterest, { foreignKey: "user_id" });
UserPointOfInterest.belongsTo(User, { foreignKey: "user_id" });
PointOfInterest.hasMany(UserPointOfInterest, {
  foreignKey: "point_of_interest_id",
});
UserPointOfInterest.belongsTo(PointOfInterest, {
  foreignKey: "point_of_interest_id",
});

PointOfInterest.hasMany(Forecast, { foreignKey: "poi_id" });
Forecast.belongsTo(PointOfInterest, { foreignKey: "poi_id" });

Location.hasMany(Alert, { foreignKey: "location_id", onDelete: 'CASCADE' });
Alert.belongsTo(Location, { foreignKey: "location_id", onDelete: 'CASCADE' });

Alert.hasMany(Notification, { foreignKey: "alert_id" });
Notification.belongsTo(Alert, { foreignKey: "alert_id" });

User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });

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
};

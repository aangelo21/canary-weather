// Import Sequelize instance for model definition
import sequelize from '../controllers/dbController.js';
// Import DataTypes for defining column types
import { DataTypes } from 'sequelize';

/**
 * UserPointOfInterest Model
 *
 * Represents the association between a User and a PointOfInterest.
 * Used to track which POIs a user has favorited.
 *
 * @typedef {Object} UserPointOfInterest
 * @property {string} id - Unique identifier (UUID).
 * @property {string} user_id - Foreign key referencing the User.
 * @property {string} point_of_interest_id - Foreign key referencing the PointOfInterest.
 * @property {Date} favorited_at - Timestamp when the POI was favorited.
 */
const UserPointOfInterest = sequelize.define(
    'UserPointOfInterest',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        point_of_interest_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        favorited_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    { timestamps: false },
);

// Export the UserPointOfInterest model for use in other parts of the application
export default UserPointOfInterest;

import sequelize from '../controllers/dbController.js';
import { DataTypes } from 'sequelize';


const PushSubscription = sequelize.define(
    'PushSubscription',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        endpoint: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        p256dh: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        auth: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'PushSubscriptions',
        timestamps: true,
    },
);

export default PushSubscription;

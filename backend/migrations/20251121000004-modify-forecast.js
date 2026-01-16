'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Forecasts', 'condition', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecasts', 'humidity', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecasts', 'air_pressure', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecasts', 'wind_speed', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecasts', 'poi_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'PointOfInterests',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        await queryInterface.removeColumn('Forecasts', 'wind');
        await queryInterface.removeColumn('Forecasts', 'rain_probability');
        await queryInterface.removeColumn('Forecasts', 'date_time');
        await queryInterface.removeColumn('Forecasts', 'location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Forecasts', 'wind', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecasts', 'rain_probability', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecasts', 'date_time', {
            type: Sequelize.DATE,
            allowNull: false,
        });

        await queryInterface.addColumn('Forecasts', 'location_id', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Locations',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        await queryInterface.removeColumn('Forecasts', 'condition');
        await queryInterface.removeColumn('Forecasts', 'humidity');
        await queryInterface.removeColumn('Forecasts', 'air_pressure');
        await queryInterface.removeColumn('Forecasts', 'wind_speed');
        await queryInterface.removeColumn('Forecasts', 'poi_id');
    },
};

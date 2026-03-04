'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Forecast', 'condition', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecast', 'humidity', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecast', 'air_pressure', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecast', 'wind_speed', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecast', 'poi_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'PointOfInterest',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        await queryInterface.removeColumn('Forecast', 'wind');
        await queryInterface.removeColumn('Forecast', 'rain_probability');
        await queryInterface.removeColumn('Forecast', 'date_time');
        await queryInterface.removeColumn('Forecast', 'location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Forecast', 'wind', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecast', 'rain_probability', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        });

        await queryInterface.addColumn('Forecast', 'date_time', {
            type: Sequelize.DATE,
            allowNull: false,
        });

        await queryInterface.addColumn('Forecast', 'location_id', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Location',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        await queryInterface.removeColumn('Forecast', 'condition');
        await queryInterface.removeColumn('Forecast', 'humidity');
        await queryInterface.removeColumn('Forecast', 'air_pressure');
        await queryInterface.removeColumn('Forecast', 'wind_speed');
        await queryInterface.removeColumn('Forecast', 'poi_id');
    },
};

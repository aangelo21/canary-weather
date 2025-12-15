'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Forecast', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            temperature: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            wind: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            rain_probability: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            date_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            location_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Location',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Forecast');
    },
};

'use strict';

// Migration: create the Alert (warnings) table to match the Alert model
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Alert', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            level: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            phenomenon: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            location_id: {
                type: Sequelize.UUID,
                allowNull: false,
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

    async down(queryInterface) {
        await queryInterface.dropTable('Alert');
    },
};

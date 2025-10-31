"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Location", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            aemet_code: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            is_coastal: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            coast_code_id: {
                type: Sequelize.UUID,
                allowNull: true,
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
        await queryInterface.dropTable("Location");
    },
};

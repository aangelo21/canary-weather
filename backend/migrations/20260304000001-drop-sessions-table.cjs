'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.dropTable('Sessions');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.createTable('Sessions', {
            sid: {
                type: Sequelize.STRING(36),
                primaryKey: true,
            },
            expires: {
                type: Sequelize.DATE,
            },
            data: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
};

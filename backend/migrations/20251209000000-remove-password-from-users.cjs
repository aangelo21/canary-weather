'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if the column exists before trying to remove it to avoid errors
        const tableInfo = await queryInterface.describeTable('User');
        if (tableInfo.password) {
            await queryInterface.removeColumn('User', 'password');
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('User');
        if (!tableInfo.password) {
            await queryInterface.addColumn('User', 'password', {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },
};

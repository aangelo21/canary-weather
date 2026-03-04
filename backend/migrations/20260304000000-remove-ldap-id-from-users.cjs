'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('User', 'ldap_id');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('User', 'ldap_id', {
            type: Sequelize.UUID,
            allowNull: true,
            unique: true,
        });
    },
};

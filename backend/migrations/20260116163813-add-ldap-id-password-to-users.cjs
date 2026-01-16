'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('User', 'ldap_id', {
            type: Sequelize.UUID,
            allowNull: true,
            unique: true,
        });

        await queryInterface.addColumn('User', 'password', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('User', 'ldap_id');
        await queryInterface.removeColumn('User', 'password');
    },
};

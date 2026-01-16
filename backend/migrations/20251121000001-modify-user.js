'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'is_admin', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });

        await queryInterface.removeColumn('Users', 'default_location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'is_admin');

        await queryInterface.addColumn('Users', 'default_location_id', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },
};

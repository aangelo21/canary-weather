'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('User', 'is_admin', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });

        await queryInterface.removeColumn('User', 'default_location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('User', 'is_admin');

        await queryInterface.addColumn('User', 'default_location_id', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },
};

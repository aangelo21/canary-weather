'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Alerts', 'location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Alerts', 'location_id', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Locations',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    },
};

'use strict';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Alert', 'location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Alert', 'location_id', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Location',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    },
};

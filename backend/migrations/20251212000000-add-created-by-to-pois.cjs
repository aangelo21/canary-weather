'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('PointOfInterest', 'created_by', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'User',
                key: 'id',
            },
            onDelete: 'SET NULL',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PointOfInterest', 'created_by');
    },
};

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PointOfInterests', 'description');
        await queryInterface.removeColumn('PointOfInterests', 'location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('PointOfInterests', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        await queryInterface.addColumn('PointOfInterests', 'location_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'Locations',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },
};

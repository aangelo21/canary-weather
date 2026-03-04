'use strict';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PointOfInterest', 'description');
        await queryInterface.removeColumn('PointOfInterest', 'location_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('PointOfInterest', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        await queryInterface.addColumn('PointOfInterest', 'location_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'Location',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },
};

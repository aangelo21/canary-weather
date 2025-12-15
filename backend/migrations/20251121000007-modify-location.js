'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Locations', 'is_coastal');
        await queryInterface.removeColumn('Locations', 'coast_code_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Locations', 'is_coastal', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        });

        await queryInterface.addColumn('Locations', 'coast_code_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'CoastCodes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },
};

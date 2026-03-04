'use strict';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Location', 'is_coastal');
        await queryInterface.removeColumn('Location', 'coast_code_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Location', 'is_coastal', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        });

        await queryInterface.addColumn('Location', 'coast_code_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'CoastCode',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },
};

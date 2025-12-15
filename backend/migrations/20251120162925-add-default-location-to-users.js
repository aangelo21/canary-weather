'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'default_location_id', {
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

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'default_location_id');
    },
};

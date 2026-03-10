'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserLocation', {
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },
            location_id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },
            selected_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserLocation');
    },
};

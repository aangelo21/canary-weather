'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('User', 'profile_picture_url', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('User', 'profile_picture_url');
    },
};

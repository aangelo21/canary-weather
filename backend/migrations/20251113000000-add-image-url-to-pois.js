'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('PointOfInterest', 'image_url', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('PointOfInterest', 'image_url');
    },
};

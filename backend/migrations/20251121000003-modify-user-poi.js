'use strict';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('UserPointOfInterest', 'id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        });

        await queryInterface.removeConstraint(
            'UserPointOfInterest',
            'PRIMARY',
        );

        await queryInterface.addConstraint('UserPointOfInterest', {
            fields: ['id'],
            type: 'primary key',
            name: 'UserPointOfInterests_pkey',
        });

        await queryInterface.addConstraint('UserPointOfInterest', {
            fields: ['user_id', 'point_of_interest_id'],
            type: 'unique',
            name: 'user_poi_unique',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint(
            'UserPointOfInterest',
            'UserPointOfInterests_pkey',
        );
        await queryInterface.removeConstraint(
            'UserPointOfInterest',
            'user_poi_unique',
        );

        await queryInterface.addConstraint('UserPointOfInterest', {
            fields: ['user_id', 'point_of_interest_id'],
            type: 'primary key',
            name: 'PRIMARY',
        });

        await queryInterface.removeColumn('UserPointOfInterest', 'id');
    },
};

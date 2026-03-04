'use strict';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('UserLocation', 'id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        });

        await queryInterface.removeConstraint('UserLocation', 'PRIMARY');

        await queryInterface.addConstraint('UserLocation', {
            fields: ['id'],
            type: 'primary key',
            name: 'UserLocations_pkey',
        });

        await queryInterface.addConstraint('UserLocation', {
            fields: ['user_id', 'location_id'],
            type: 'unique',
            name: 'user_location_unique',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint(
            'UserLocation',
            'UserLocations_pkey',
        );
        await queryInterface.removeConstraint(
            'UserLocation',
            'user_location_unique',
        );

        await queryInterface.addConstraint('UserLocation', {
            fields: ['user_id', 'location_id'],
            type: 'primary key',
            name: 'PRIMARY',
        });

        await queryInterface.removeColumn('UserLocation', 'id');
    },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserLocations', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    });

    await queryInterface.removeConstraint('UserLocations', 'PRIMARY');
    
    await queryInterface.addConstraint('UserLocations', {
      fields: ['id'],
      type: 'primary key',
      name: 'UserLocations_pkey'
    });

    await queryInterface.addConstraint('UserLocations', {
      fields: ['user_id', 'location_id'],
      type: 'unique',
      name: 'user_location_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('UserLocations', 'UserLocations_pkey');
    await queryInterface.removeConstraint('UserLocations', 'user_location_unique');
    
    await queryInterface.addConstraint('UserLocations', {
      fields: ['user_id', 'location_id'],
      type: 'primary key',
      name: 'PRIMARY'
    });

    await queryInterface.removeColumn('UserLocations', 'id');
  }
};

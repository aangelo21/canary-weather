'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserPointOfInterests', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    });

    await queryInterface.removeConstraint('UserPointOfInterests', 'PRIMARY');
    
    await queryInterface.addConstraint('UserPointOfInterests', {
      fields: ['id'],
      type: 'primary key',
      name: 'UserPointOfInterests_pkey'
    });

    await queryInterface.addConstraint('UserPointOfInterests', {
      fields: ['user_id', 'point_of_interest_id'],
      type: 'unique',
      name: 'user_poi_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('UserPointOfInterests', 'UserPointOfInterests_pkey');
    await queryInterface.removeConstraint('UserPointOfInterests', 'user_poi_unique');
    
    await queryInterface.addConstraint('UserPointOfInterests', {
      fields: ['user_id', 'point_of_interest_id'],
      type: 'primary key',
      name: 'PRIMARY'
    });

    await queryInterface.removeColumn('UserPointOfInterests', 'id');
  }
};

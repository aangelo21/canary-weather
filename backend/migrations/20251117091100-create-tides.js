"use strict";

// Migration: create the Tide table to match the Tide model
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tide", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      height: {
        type: Sequelize.DOUBLE,
        allowNull: true,co
      },
      location_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      coast_code_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Tide");
  },
};

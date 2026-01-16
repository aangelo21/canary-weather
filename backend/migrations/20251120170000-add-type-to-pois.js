import { DataTypes } from 'sequelize';


export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('PointOfInterest', 'type', {
        type: Sequelize.ENUM('global', 'local', 'personal'),
        allowNull: false,
        defaultValue: 'local',
    });

    
    await queryInterface.sequelize.query(`
    UPDATE PointOfInterest
    SET type = CASE
      WHEN is_global = 1 THEN 'global'
      ELSE 'local'
    END
  `);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('PointOfInterest', 'type');
    
    await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_PointOfInterest_type"',
    );
}

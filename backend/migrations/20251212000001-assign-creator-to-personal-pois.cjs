'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Para cada POI personal sin created_by, asignar el usuario de UserPointOfInterest
        await queryInterface.sequelize.query(`
            UPDATE PointOfInterest poi
            SET poi.created_by = (
                SELECT upi.user_id
                FROM UserPointOfInterest upi
                WHERE upi.point_of_interest_id = poi.id
                LIMIT 1
            )
            WHERE poi.type = 'personal' AND poi.created_by IS NULL
            AND EXISTS (
                SELECT 1 FROM UserPointOfInterest upi
                WHERE upi.point_of_interest_id = poi.id
            )
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // Para revertir, no hacer nada específico ya que solo estamos llenando valores NULL
        // Si quisieras revertir completamente, podrías hacer:
        // await queryInterface.sequelize.query(`
        //     UPDATE PointOfInterest SET created_by = NULL WHERE type = 'personal'
        // `);
    },
};

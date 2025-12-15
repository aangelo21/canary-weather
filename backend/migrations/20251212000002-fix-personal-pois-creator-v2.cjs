'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Actualización usando INNER JOIN para asegurar que se asigna el usuario correcto
        // Esta query actualiza el campo created_by tomando el user_id de la tabla intermedia UserPointOfInterest
        await queryInterface.sequelize.query(`
            UPDATE PointOfInterest poi
            INNER JOIN UserPointOfInterest upi ON poi.id = upi.point_of_interest_id
            SET poi.created_by = upi.user_id
            WHERE poi.type = 'personal'
            AND poi.created_by IS NULL
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // No se requiere reversión ya que solo estamos corrigiendo datos faltantes
    },
};

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            UPDATE "PointOfInterest"
            SET created_by = upi.user_id::uuid
            FROM "UserPointOfInterest" upi
            WHERE "PointOfInterest".id = upi.point_of_interest_id
            AND "PointOfInterest".type = 'personal'
            AND "PointOfInterest".created_by IS NULL
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // No rollback needed — only correcting missing data
    },
};

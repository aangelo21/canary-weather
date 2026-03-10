'use strict';

// The LDAP migration (20251202000000) changed user_id from UUID to STRING on
// three tables. LDAP was later removed but user_id was never reverted.
// Models expect UUID, so this migration restores the correct type.
// PostgreSQL requires explicit USING clause for varchar->uuid cast.
module.exports = {
    async up(queryInterface, Sequelize) {
        const tables = ['UserLocation', 'UserPointOfInterest', 'Notifications'];
        for (const table of tables) {
            await queryInterface.sequelize.query(
                `ALTER TABLE "${table}" ALTER COLUMN user_id TYPE uuid USING user_id::uuid`
            );
        }
    },

    async down(queryInterface, Sequelize) {
        const tables = ['UserLocation', 'UserPointOfInterest', 'Notifications'];
        for (const table of tables) {
            await queryInterface.sequelize.query(
                `ALTER TABLE "${table}" ALTER COLUMN user_id TYPE varchar(255) USING user_id::text`
            );
        }
    },
};

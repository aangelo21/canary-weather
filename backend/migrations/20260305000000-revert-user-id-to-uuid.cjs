'use strict';

// The LDAP migration (20251202000000) changed user_id from UUID to STRING on
// three tables. LDAP was later removed but user_id was never reverted.
// Models expect UUID, so this migration restores the correct type.
module.exports = {
    async up(queryInterface, Sequelize) {
        const tables = ['UserLocation', 'UserPointOfInterest', 'Notifications'];
        for (const table of tables) {
            await queryInterface.changeColumn(table, 'user_id', {
                type: Sequelize.UUID,
                allowNull: false,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tables = ['UserLocation', 'UserPointOfInterest', 'Notifications'];
        for (const table of tables) {
            await queryInterface.changeColumn(table, 'user_id', {
                type: Sequelize.STRING,
                allowNull: false,
            });
        }
    },
};

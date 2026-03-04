'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const dropForeignKey = async (tableName, columnName) => {
            const [results] = await queryInterface.sequelize.query(
                `SELECT tc.constraint_name
         FROM information_schema.table_constraints tc
         JOIN information_schema.constraint_column_usage ccu
           ON tc.constraint_name = ccu.constraint_name
           AND tc.table_schema = ccu.table_schema
         WHERE tc.table_name = '${tableName}'
         AND tc.constraint_type = 'FOREIGN KEY'
         AND EXISTS (
           SELECT 1 FROM information_schema.key_column_usage kcu
           WHERE kcu.constraint_name = tc.constraint_name
           AND kcu.column_name = '${columnName}'
         );`,
            );

            if (results && results.length > 0) {
                for (const row of results) {
                    const constraintName = row.constraint_name;
                    console.log(
                        `Dropping constraint ${constraintName} on ${tableName}`,
                    );
                    try {
                        await queryInterface.removeConstraint(
                            tableName,
                            constraintName,
                        );
                    } catch (e) {
                        console.log(
                            `Failed to remove ${constraintName}: ${e.message}`,
                        );
                    }
                }
            } else {
                console.log(
                    `No foreign key found for ${tableName}.${columnName}`,
                );
            }
        };

        await dropForeignKey('UserLocation', 'user_id');

        await dropForeignKey('UserPointOfInterest', 'user_id');

        await dropForeignKey('Notification', 'user_id');

        const changeCol = async (tableName) => {
            try {
                await queryInterface.changeColumn(tableName, 'user_id', {
                    type: Sequelize.STRING,
                    allowNull: false,
                });
            } catch (err) {
                console.error(
                    `Failed to change column on ${tableName}:`,
                    err.message,
                );
                throw err;
            }
        };

        await changeCol('UserLocation');
        await changeCol('UserPointOfInterest');
        await changeCol('Notification');
    },

    async down(queryInterface, Sequelize) {},
};

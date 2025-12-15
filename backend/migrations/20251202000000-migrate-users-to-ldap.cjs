'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Helper to find and drop FK
        const dropForeignKey = async (tableName, columnName) => {
            // Try to find constraint by column usage
            const [results] = await queryInterface.sequelize.query(
                `SELECT CONSTRAINT_NAME
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_NAME = '${tableName}'
         AND COLUMN_NAME = '${columnName}'
         AND REFERENCED_TABLE_NAME IS NOT NULL;`,
            );

            if (results && results.length > 0) {
                for (const row of results) {
                    const constraintName = row.CONSTRAINT_NAME;
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
                // Fallback: try to remove common names
                const commonNames = [
                    `${tableName}_${columnName}_foreign_idx`,
                    `${tableName}_ibfk_1`,
                    `${tableName}_ibfk_2`,
                    `${tableName}_ibfk_321`, // The one we saw
                ];
                for (const name of commonNames) {
                    try {
                        await queryInterface.removeConstraint(tableName, name);
                    } catch (e) {}
                }
            }
        };

        // 1. UserLocation
        await dropForeignKey('UserLocation', 'user_id');

        // 2. UserPointOfInterest
        await dropForeignKey('UserPointOfInterest', 'user_id');

        // 3. Notification
        await dropForeignKey('Notification', 'user_id');

        // Now change columns
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

    async down(queryInterface, Sequelize) {
        // Revert logic
    },
};

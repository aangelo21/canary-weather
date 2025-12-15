'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const dropForeignKey = async (tableName, columnName) => {
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
                const commonNames = [
                    `${tableName}_${columnName}_foreign_idx`,
                    `${tableName}_ibfk_1`,
                    `${tableName}_ibfk_2`,
                    `${tableName}_ibfk_321`,
                ];
                for (const name of commonNames) {
                    try {
                        await queryInterface.removeConstraint(tableName, name);
                    } catch (e) {}
                }
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

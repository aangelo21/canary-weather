'use strict';

// No-op: this migration used MySQL-incompatible SQL.
// The fix is in 20251212000002-fix-personal-pois-creator-v2.cjs which uses correct PostgreSQL syntax.
module.exports = {
    up: async (queryInterface, Sequelize) => {},
    down: async (queryInterface, Sequelize) => {},
};

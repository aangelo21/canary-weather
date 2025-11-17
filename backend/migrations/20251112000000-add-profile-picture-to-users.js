export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "profile_picture_url", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Users", "profile_picture_url");
}

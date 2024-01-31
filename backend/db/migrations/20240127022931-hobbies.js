'use strict';
module.exports = {
  async up(queryInterface, sequelize) {
    await queryInterface.createTable('hobbies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.INTEGER,
      },
      hobby: {
        allowNull: false,
        type: sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: sequelize.DATE,
      },
    });
  },
  async down(queryInterface, sequelize) {
    await queryInterface.dropTable('hobbies');
  },
};

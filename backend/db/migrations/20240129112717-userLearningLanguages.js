'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userLearningLanguages', {
      id: {
        allowNull: false,

        autoIncrement: true,

        primaryKey: true,

        type: Sequelize.INTEGER,
      },

      userId: {
        allowNull: false,

        type: Sequelize.INTEGER,

        references: {
          model: 'users',

          key: 'id',
        },
      },

      languageId: {
        allowNull: false,

        type: Sequelize.INTEGER,

        references: {
          model: 'languages',

          key: 'id',
        },
      },

      proficiency: {
        allowNull: false,

        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,

        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,

        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userLearningLanguages');
  },
};
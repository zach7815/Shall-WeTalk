const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class hobby extends Model {}
  hobby.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      hobby: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'hobbies', // ! model name MUST match table name
    }
  );
  return hobby;
};

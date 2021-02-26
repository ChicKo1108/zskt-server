const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("Class", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  className: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})
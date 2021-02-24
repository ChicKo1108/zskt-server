const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("PunchRecord", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  punchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

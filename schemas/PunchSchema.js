const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("Punch", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "创建考勤时的纬度",
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "创建考勤时的精度",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
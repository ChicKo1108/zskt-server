const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const ClassMember = sequelize.define("ClassMember", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

ClassMember.sync({ alter: true });

module.exports = ClassMember;

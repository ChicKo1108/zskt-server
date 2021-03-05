const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./UserSchema");
const Class = require("./ClassSchema");

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
    references: {
      model: User,
      key: "id",
    },
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Class,
      key: "id",
    },
  },
});

module.exports = ClassMember;

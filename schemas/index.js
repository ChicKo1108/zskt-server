const { sequelize } = require("../config/db");

/**
 * 引入表结构
 */
const User = sequelize.import("./UserSchema");
const Class = sequelize.import("./ClassSchema");
const Punch = sequelize.import("./PunchSchema");
const PunchResult = sequelize.import("./PunchResultSchema");
const Apply = sequelize.import("./ApplySchema");
const ClassMember = sequelize.import("./ClassMemberSchema");

/**
 * 建立表关系
 */
// Class - Punch 一对多
Class.hasMany(Punch);
Punch.belongsTo(Class);

module.exports = {
  sequelize,
  User,
  Class,
  Punch,
  PunchResult,
  Apply,
  ClassMember,
};

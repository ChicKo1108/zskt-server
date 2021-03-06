const { sequelize } = require("../config/db");

/**
 * 引入表结构
 */
const User = sequelize.import("./UserSchema");
const Class = sequelize.import("./ClassSchema");
const Punch = sequelize.import("./PunchSchema");

/**
 * 建立表关系
 */
// User - Class 多对多
User.belongsToMany(Class, { through: "ClassMembers", as: "classList" });
Class.belongsToMany(User, { through: "ClassMembers", as: "studentList" });
// Class - Punch 一对多
Class.hasMany(Punch);
Punch.belongsTo(Class);

module.exports = {
  sequelize,
  User,
  Class,
  Punch,
};

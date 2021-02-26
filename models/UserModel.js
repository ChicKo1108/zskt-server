const User = require("../schemas/UserSchema");

// 检查表结构，创建表
User.sync({ alter: true });

class UserModel {
  /**
   * 创建用户
   * @param {Object} data
   */
  static async createUser(data) {
    const { realName, password, phone, avatar, role } = data;
    return await User.create({
      realName,
      password,
      phone,
      avatar,
      role,
    });
  }

  /**
   * 查找用户数据
   * @param {Number} id
   */
  static async findUserById(id) {
    return await User.findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * 根据手机号码查询用户
   * @param {String} phone 手机号
   */
  static async findUserByPhone(phone) {
    return await User.findOne({
      where: {
        phone: phone,
      },
    });
  }
}

module.exports = UserModel;

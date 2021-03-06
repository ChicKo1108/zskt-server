const { User } = require("../schemas/index");
class UserModel {
  /**
   * 创建用户
   * @param {Object} data
   */
  static async createUser(data) {
    const { realName, password, phone, avatar, role, sno } = data;
    return await User.create({
      realName,
      password,
      phone,
      avatar,
      role,
      sno,
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

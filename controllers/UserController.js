const UserModel = require("../models/UserModel");
const commonUtils = require("../utils/commonUtils");

class UserController {
  /**
   * 创建用户
   * @param {*} ctx
   */
  static async createUser(ctx) {
    // 接受客户端数据
    const req = ctx.request.body;
    const { realName, password, phone, role } = req;
    commonUtils.checkArguments(ctx, realName, password, phone, role);
    try {
      // 手机号不能重复
      const phoneHasRegisted = await UserModel.findUserByPhone(phone);
      if (phoneHasRegisted) {
        ctx.response.status = 200;
        ctx.body = {
          msg: "PHONE REGISTED",
        };
        return;
      }
      // 创建用户模型
      const result = await UserModel.createUser(req);
      // 返回用户信息
      const user = await UserModel.findUserById(result.id);
      // 注册成功后自动登录，记录session
      ctx.session.logged = true;
      ctx.session.userId = user.id;
      ctx.session.role = user.role;

      ctx.response.status = 200;
      ctx.body = {
        msg: "OK",
        data: user.id,
      };
    } catch (err) {
      ctx.response.status = 200;
      ctx.body = {
        msg: "FAIL",
      };
    }
  }

  /**
   * 登录
   * @param {*} ctx
   */
  static async login(ctx) {
    const { phone, password } = ctx.request.body;
    commonUtils.checkArguments(ctx, phone, password);
    try {
      const user = await UserModel.findUserByPhone(phone);
      if (password === user.password) {
        // 登录成功后记录session
        ctx.session.logged = true;
        ctx.session.userId = user.id;
        ctx.session.role = user.role;

        ctx.response.status = 200;
        ctx.body = {
          msg: "OK",
          data: user.id,
        };
      } else {
        ctx.response.status = 200;
        ctx.body = {
          msg: "INVALID_INFO",
        };
      }
    } catch (error) {
      console.error(error);
      ctx.response.status = 412;
      ctx.body = {
        code: 200,
        msg: "FAIL",
      };
    }
  }

  static isLogin(ctx) {
    if (ctx.session.logged) {
      ctx.status = 200;
      ctx.data = "OK";
    } else {
      ctx.status = 500;
      ctx.data = "NOT_LOGIN";
    }
  }

  static async updateUserInfo(ctx) {
    const { userInfo } = ctx.request.body;
    commonUtils.checkArguments(ctx, userInfo);
    const { userId } = ctx.session;
    userInfo.id = userId;
    const result = await UserModel.updateInfo(userInfo);
    if (result) {
      ctx.response.status = 200;
      ctx.body = true;
    } else {
      ctx.response.status = 200;
      ctx.body = false;
    }
  }

  static async findMyUserInfo (ctx) {
    const { userId } = ctx.session;
    const result = await UserModel.findUserById(userId);
    ctx.response.status = 200;
    ctx.body = result;
  }

  static async checkPassword (ctx) {
    const { password } = ctx.request.body;
    const { userId } = ctx.session;
    const result = await UserModel.getPasswordById(userId);
    ctx.response.status = 200;
    if (password !== result.getDataValue('password')) {
      ctx.body = false;
    } else {
      ctx.body = true;
    }
  }

  static async updatePassword (ctx) {
    const { oriPassword, newPassword, checkPassword } = ctx.request.body;
    commonUtils.checkArguments(ctx, oriPassword, newPassword, checkPassword);
    ctx.response.status = 200;
    const { userId } = ctx.session;
    if (await (await UserModel.getPasswordById(userId)).getDataValue('password') !== oriPassword) {
      ctx.body = "OriPassword Wrong";
    } else if (newPassword !== checkPassword) {
      ctx.body = "password not same";
    } else {
      const result = await UserModel.updatePassword(newPassword, userId);
      if (result) {
        ctx.body = "OK";
      } else {
        ctx.body = "Fail";
      }
    }
  }
}

module.exports = UserController;

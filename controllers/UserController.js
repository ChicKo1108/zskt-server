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
          msg: "PHONE REGISTED"
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
        msg: "FAIL"
      };
    }
  }


  static isLogin(ctx) {
    if(ctx.session.logged) {
      ctx.status = 200;
      ctx.data = "OK";
    } else {
      ctx.status = 500;
      ctx.data = "NOT_LOGIN";
    }
  }
}

module.exports = UserController;

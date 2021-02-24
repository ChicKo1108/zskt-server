const UserModel = require("../models/User");

class UserController {
  static async createUser(ctx) {
    // 接受客户端数据
    const req = ctx.request.body;
    if (req.realName && req.password && req.phone && req.role) {
      try {
        // 创建用户模型
        const result = await UserModel.createUser(req);
        // 返回用户信息
        const data = await UserModel.findUserById(result.id);
        ctx.response.status = 200;
        ctx.body = {
          code: 200,
          msg: "用户创建成功",
          data,
        };
      } catch (err) {
        ctx.response.status = 412;
        ctx.body = {
          code: 200,
          msg: "用户创建失败",
          data: err,
        };
      }
    } else {
      ctx.response.status = 416;
      ctx.body = {
        code: 200,
        msg: "参数不全",
      };
    }
  }
}

module.exports = UserController;

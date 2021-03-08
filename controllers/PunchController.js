const PunchModel = require("../models/PunchModel");
const ClassModel = require("../models/ClassModel");
const CommonUtils = require("../utils/commonUtils");

class PunchController {
  // 创建打卡
  static async createPunch(ctx) {
    const { classId, lng, lat, startTime, endTime, address } = ctx.request.body;
    CommonUtils.checkArguments(
      ctx,
      classId,
      lng,
      lat,
      startTime,
      endTime,
      address
    );

    ctx.response.status = 200;
    if (new Date(endTime) <= new Date(startTime)) {
      ctx.body = {
        msg: "ILLEAGLE_TIME",
      };
    } else {
      const result = await PunchModel.createPunch(
        classId,
        lng,
        lat,
        address,
        startTime,
        endTime
      );
      ctx.body = {
        msg: "OK",
        data: result,
      };
    }
  }

  // 终止打卡
  static async stopPunch(ctx) {
    const { id } = ctx.request.query;
    CommonUtils.checkArguments(ctx, id);

    ctx.response.status = 200;
    await PunchModel.stopPunch(id);
    ctx.body = true;
  }

  // 获取正在进行的打卡
  static async getPunching(ctx) {
    ctx.response.status = 200;
    const { userId } = ctx.session;
    const classes = await ClassModel.findClassIdsByOwnerId(userId) || [];
    const classIds = classes.map(v => v.getDataValue('id'))
    const punchingList = (await PunchModel.getPunchings(classIds)) || [];
    ctx.body = punchingList;
  }
}

module.exports = PunchController;

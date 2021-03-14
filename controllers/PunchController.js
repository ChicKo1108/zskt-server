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
    } else if(new Date(endTime) <= new Date()) {
      ctx.body = {
        msg: "END_TIME_SHOULD_AFTER_NOW"
      }
    } else {
      const result = await PunchModel.createPunch(
        classId,
        lng,
        lat,
        address,
        startTime,
        endTime
      );
      const punchId = result.getDataValue('id');
      if (punchId) {
        const timerId = setTimeout(async () => {
          // TODO: 发送socket给前端告知打卡已结束
          console.log(`punchId为${punchId}的打卡结束了!`);
        }, new Date(endTime) - new Date());
        // 将timerId存入全局变量
        ctx.punchingTimerList[punchId] = timerId;
      }
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

    clearTimeout(ctx.punchingTimerList[id] || 0);
    if (ctx.punchingTimerList[id]) {
      delete ctx.punchingTimerList[id];
    }
    
    ctx.response.status = 200;
    await PunchModel.stopPunch(id);
    ctx.body = true;
  }

  // 获取正在进行的打卡
  static async getPunching(ctx) {
    ctx.response.status = 200;
    const { userId } = ctx.session;
    const classes = await ClassModel.findClassesByOwnerId(userId) || [];
    const classIds = classes.map(v => v.getDataValue('id'))
    const punchingList = (await PunchModel.getPunchings(classIds)) || [];
    ctx.body = punchingList;
  }

  // 根据Id查询打卡
  static async getPunchById (ctx) {
    const { id } = ctx.request.query;
    CommonUtils.checkArguments(ctx, id);
    const punchVo = await PunchModel.getPunchById(id);
    const classId = punchVo.getDataValue('ClassId');
    const classVo = await ClassModel.findById(classId);
    if (punchVo) {
      ctx.response.status = 200;
      ctx.body = {
        punchVo,
        classVo
      };
    } else {
      ctx.response.status = 500;
      ctx.body = {};
    }
  }

  static async readPunch (ctx) {
    const { id } = ctx.request.query;
    CommonUtils.checkArguments(ctx, id);
    const result = await PunchModel.readPunch(id);
    ctx.response.status = 200;
    if (result) {
      ctx.body = true;
    } else {
      ctx.body = false;
    }
  }

  static async deletePunch (ctx) {
    const { id } = ctx.request.query;
    CommonUtils.checkArguments(ctx, id);
    await PunchModel.deletePunch(id);
    ctx.response.status = 200;
    ctx.body = true;
  }
}

module.exports = PunchController;

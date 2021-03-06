const PunchModel = require('../models/PunchModel');
const CommonUtils = require('../utils/commonUtils');

class PunchController {
  static async createPunch (ctx) {
    const { classId, lng, lat, startTime, endTime, address } = ctx.request.body;
    CommonUtils.checkArguments(ctx, classId, lng, lat, startTime, endTime, address);

    ctx.response.status = 200;
    if (new Date(endTime) <= new Date(startTime)) {
      ctx.body = {
        msg: "ILLEAGLE_TIME"
      };
    } else {
      const result = await PunchModel.createPunch(classId, lng, lat, address, startTime, endTime);
      ctx.body = {
        msg: "ok",
        data: result,
      }
    }
  }
}

module.exports = PunchController;
const { Punch } = require('../schemas/index');
const { Op } = require('sequelize');

class PunchModel {
  // 创建打卡
  static async createPunch (classId, lng, lat, address, startTime, endTime) {
    return await Punch.create({ ClassId: classId, lng, lat, address, startTime, endTime, stop: false });
  }

  // 提前停止打卡
  static async stopPunch (id) {
    return await Punch.update({ stop: true }, {
      where: { id },
    })
  }

  static async getPunchings (classIds) {
    return await Punch.findAll({
      where: {
        ClassId: { [Op.in]: classIds },
        endTime: { [Op.gt]: new Date() },
        stop: 0,
      }
    })
  }
}

module.exports = PunchModel;
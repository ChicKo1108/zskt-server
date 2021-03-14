const { Punch } = require("../schemas/index");
const { Op } = require("sequelize");

class PunchModel {
  // 创建打卡
  static async createPunch(classId, lng, lat, address, startTime, endTime) {
    return await Punch.create({
      ClassId: classId,
      lng,
      lat,
      address,
      startTime,
      endTime,
      stop: false,
      read: false,
    });
  }

  // 提前停止打卡
  static async stopPunch(id) {
    return await Punch.update(
      { endTime: new Date() },
      {
        where: { id },
      }
    );
  }

  static async getPunchings(classIds) {
    return await Punch.findAll({
      where: {
        ClassId: { [Op.in]: classIds },
        endTime: { [Op.gt]: new Date() },
      },
    });
  }

  static async getEndPunchings (classIds) {
    return await Punch.findAll({
      attributes: ['id', 'read', 'endTime', 'ClassId'],
      where: {
        ClassId: { [Op.in]: classIds },
        endTime: { [Op.lte]: new Date() },
      },
      order: [['endTime', 'DESC']],
    })
  }

  static async getPunchById (id) {
    return await Punch.findOne({
      where: { id }
    });
  }

  static async readPunch (id) {
    return await Punch.update({ read: true }, {
      where: { id }
    });
  }

  static async deletePunch (id) {
    return await Punch.destroy({
      where: { id }
    })
  }
}

module.exports = PunchModel;

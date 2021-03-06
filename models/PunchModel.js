const { Punch } = require('../schemas/index');

class PunchModel {
  static async createPunch (classId, lng, lat, address, startTime, endTime) {
    return await Punch.create({ classId, lng, lat, address, startTime, endTime });
  }
}

module.exports = PunchModel;
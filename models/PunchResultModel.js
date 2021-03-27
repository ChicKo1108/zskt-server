const { PunchResult } = require("../schemas/index");

class PunchResultModel {
  static async add(punchId, studentId) {
    return await PunchResult.create({ punchId, studentId, isLeave: false });
  }

  static async addLeave (punchId, studentId) {
    return await PunchResult.create({ punchId, studentId, isLeave: true });
  }

  static async findByStudentIdAndPunchId(studentId, punchId) {
    return await PunchResult.findOne({ where: { studentId, punchId } });
  }

  static async findByPunchId(punchId) {
    return await PunchResult.findAll({ where: { punchId } });
  }

}

module.exports = PunchResultModel;

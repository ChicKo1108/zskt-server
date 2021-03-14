const { PunchResult } = require("../schemas/index");

class PunchResultModel {
  static async add (punchId) {
    return await PunchResult.create({ punchId, read: false });
  }

  static async doRead (id) {
    return await PunchResult.update({ read: true }, {
      where: { punchId: id }
    })
  }

}

module.exports = PunchResultModel;
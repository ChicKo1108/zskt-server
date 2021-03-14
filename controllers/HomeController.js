const ClassModel = require('../models/ClassModel');
const PunchModel = require('../models/PunchModel');

class HomeController {
  static async getPageData (ctx) {
    const { userId, role } = ctx.session;
    // 获取班级列表
    const classList = await ClassModel.findClassesByOwnerId(userId) || [];
    // 获取正在进行考勤的班级列表
    const classIds = classList.map(v => v.getDataValue('id'));
    const punchingList = await (await PunchModel.getPunchings(classIds)).map(punch => {
      const cls = classList.find(cls => cls.getDataValue('id') === punch.getDataValue('ClassId'))
      return {
        id: punch.getDataValue('id'),
        lat: punch.getDataValue('lat'),
        lng: punch.getDataValue('lng'),
        startTime: punch.getDataValue('startTime'),
        endTime: punch.getDataValue('endTime'),
        address: punch.getDataValue('address'),
        className: cls.getDataValue('className'),
      }
    });
    // 获取考勤结果通知
    const endPunchList = await (await PunchModel.getEndPunchings(classIds)).map(punch => {
      const cls = classList.find(cls => cls.getDataValue('id') === punch.getDataValue('ClassId'));
      // TODO: 增加考勤结果
      return {
        id: punch.getDataValue('id'),
        endTime: punch.getDataValue('endTime'),
        read: punch.getDataValue('read'),
        className: cls.getDataValue('className'),
      }
    });

    ctx.response.status = 200;
    ctx.body = {
      classList,
      punchingList,
      endPunchList,
    }
  }
}

module.exports = HomeController;
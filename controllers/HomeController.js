const ApplyModel = require('../models/ApplyModel');
const ClassModel = require('../models/ClassModel');
const PunchModel = require('../models/PunchModel');
const UserModel = require('../models/UserModel');

class HomeController {
  static async getPageData (ctx) {
    const { userId, role } = ctx.session;
    // 获取班级列表
    const classList = await ClassModel.findClassesByOwnerId(userId) || [];
    // 获取正在进行考勤的班级列表
    const classIds = classList.map(v => v.id);
    const punchingList = await (await PunchModel.getPunchings(classIds)).map(punch => {
      const cls = classList.find(cls => cls.id === punch.ClassId)
      return {
        id: punch.id,
        lat: punch.lat,
        lng: punch.lng,
        startTime: punch.startTime,
        endTime: punch.endTime,
        address: punch.address,
        className: cls.className,
      }
    });
    // 获取考勤结果通知
    const endPunchList = await (await PunchModel.getEndPunchings(classIds)).map(punch => {
      const cls = classList.find(cls => cls.id === punch.ClassId);
      // TODO: 增加考勤结果
      return {
        id: punch.id,
        endTime: punch.endTime,
        read: punch.read,
        className: cls.className,
      }
    });
    // 消息通知
    const applyList = await ApplyModel.getApplyList(classIds);
    const noticeList = await Promise.all(applyList.map(async function (apply) {
      const userVo = await UserModel.findUserById(apply.studentId);
      const classVo = await ClassModel.findById(apply.classId);
      return await {
        classVo,
        userVo,
        createdAt: apply.createdAt,
        updatedAt: apply.updatedAt,
        id: apply.id,
        isPass: apply.isPass,
      }
    }))
    // 获取用户信息
    const userInfo = await UserModel.findUserByIdWithoutPwd(userId);
    ctx.response.status = 200;
    ctx.body = {
      classList,
      punchingList,
      endPunchList,
      userInfo,
      noticeList,
    }
  }
}

module.exports = HomeController;
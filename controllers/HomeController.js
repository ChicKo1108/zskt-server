const ApplyModel = require("../models/ApplyModel");
const ClassMemberModel = require("../models/ClassMemberModel");
const ClassModel = require("../models/ClassModel");
const PunchModel = require("../models/PunchModel");
const UserModel = require("../models/UserModel");

class HomeController {
  static async getPageData(ctx) {
    const { userId, role } = ctx.session;

    // 获取班级列表
    let classList;
    let classIdList
    if (role === "TEACHER") {
      classList = (await ClassModel.findClassesByOwnerId(userId)) || [];
      classIdList = classList.map((v) => v.id);
    } else {
      classIdList = await (await ClassMemberModel.getClassListByStudentId(userId)).map(v => v.classId);
      classList = await ClassModel.findByIds(classIdList);
    }

    // 获取正在进行考勤的班级列表
    const punchingList = await (await PunchModel.getPunchings(classIdList)).map(
      (punch) => {
        const cls = classList.find((cls) => cls.id === punch.ClassId);
        return {
          id: punch.id,
          lat: punch.lat,
          lng: punch.lng,
          startTime: punch.startTime,
          endTime: punch.endTime,
          address: punch.address,
          className: cls.className,
        };
      }
    );

    // 获取考勤结果通知
    const endPunchList = await (await PunchModel.getEndPunchings(classIdList)).map(
      (punch) => {
        const cls = classList.find((cls) => cls.id === punch.ClassId);
        // TODO: 增加考勤结果
        return {
          id: punch.id,
          endTime: punch.endTime,
          read: punch.read,
          className: cls.className,
        };
      }
    );

    // 获取消息通知
    let applyList;
    if (role === "TEACHER") {
      applyList = await ApplyModel.getApplyList(classIdList);
    } else {
      applyList = await ApplyModel.getApplyListByStudentId(userId);
    }
    const noticeList = await Promise.all(
      applyList.map(async function (apply) {
        const userVo = await UserModel.findUserById(apply.studentId);
        const classVo = await ClassModel.findById(apply.classId);
        return await {
          classVo,
          userVo,
          createdAt: apply.createdAt,
          updatedAt: apply.updatedAt,
          id: apply.id,
          isPass: apply.isPass,
        };
      })
    );
    
    // 获取用户信息
    const userInfo = await UserModel.findUserByIdWithoutPwd(userId);
    ctx.response.status = 200;
    ctx.body = {
      classList,
      punchingList,
      endPunchList,
      userInfo,
      noticeList,
    };
  }
}

module.exports = HomeController;

const PunchModel = require("../models/PunchModel");
const ClassModel = require("../models/ClassModel");
const CommonUtils = require("../utils/commonUtils");
const ClassMemberModel = require("../models/ClassMemberModel");
const PunchResultModel = require("../models/PunchResultModel");
const UserModel = require("../models/UserModel");

class PunchController {
  // 创建打卡
  static async createPunch (ctx) {
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
      const { userId } = ctx.session;
      const classVo = await ClassModel.findById(classId);
    if (classVo.ownerId !== userId) {
      ctx.body = {
        msg: "NO_AUTHORITY"
      }
    }else if (new Date(endTime) <= new Date(startTime)) {
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
    const { userId, role } = ctx.session;
    let classIds;
    if (role === 'TEACHER') {
      const classes = await ClassModel.findClassesByOwnerId(userId) || [];
      classIds = classes.map(v => v.id)
    } else {
      classIds = await (await ClassMemberModel.getClassListByStudentId(userId)).map(v => v.classId);
    }
    const punchingList = (await PunchModel.getPunchings(classIds)) || [];
    ctx.body = punchingList;
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

  // 学生进行打卡
  static async joinPunch (ctx) {
    const { id: punchId, isLeave = false } = ctx.request.query;
    CommonUtils.checkArguments(ctx, punchId);
    ctx.response.status = 200;
    const { userId } = ctx.session;
    // 检查打卡人是否在班级中
    const punchVo = await PunchModel.findById(punchId);
    const classId = punchVo.ClassId;
    const doIIn = await ClassMemberModel.findStuByClassId(classId, userId);
    if (!(doIIn && doIIn.id)) {
      ctx.body = "NO_AUTHORITY";
      return;
    }
    // 检查打卡时间
    if (new Date() > punchVo.endTime) {
      ctx.body = "PUNCHING_ALREADY_ENDING";
      return;
    }
    // 检查是否已经打过卡
    const hasPunch = await PunchResultModel.findByStudentIdAndPunchId(userId, punchId);
    if (hasPunch && hasPunch.id) {
      ctx.body = "USER_HAS_BEEN_PUNCHED"
      return;
    }
    const result = isLeave ? await PunchResultModel.addLeave(punchId, userId) : await PunchResultModel.add(punchId, userId);
    ctx.body = result && result.id;
  }

  // 根据Id获取某次打卡的统计
  static async getPunchDetail (ctx) {
    const { id: punchId } = ctx.request.query;
    CommonUtils.checkArguments(ctx, punchId);
    ctx.response.status = 200;
    const punchVo = await PunchModel.findById(punchId);
    const classVo = await ClassModel.findById(punchVo.ClassId);
    // 获取班级成员
    const classMemberList = await (await ClassMemberModel.loadStudentListById(classVo.id)).map(v => v.studentId);

    const punchResultList = await PunchResultModel.findByPunchId(punchId);
    // 获取已打卡人员列表
    const punchedIdList = (punchResultList.filter(v => !v.isLeave)).map(v => v.studentId);
    const punchedList = await UserModel.findUserByIds(punchedIdList);
    // 获取请假人员列表
    const leaveIdList = punchResultList.filter(v => v.isLeave).map(v => v.studentId);
    const leavedList = await UserModel.findUserByIds(leaveIdList);
    // 获取未打卡人员列表
    const unPunchIdList = classMemberList.filter(v => [...punchedIdList, ...leaveIdList].findIndex(vv => v === vv) < 0);
    const unPunchedList = await UserModel.findUserByIds(unPunchIdList);
    const result = {
      startTime: punchVo.startTime,
      endTime: punchVo.endTime,
      classVo,
      address: punchVo.address,
      punchedList,
      leavedList,
      unPunchedList,
    };
    ctx.body = result;
  }

  // 获取打卡结果列表
  static async getPunchList (ctx) {
    const { userId, role } = ctx.session;
    let classIds;
    if (role === 'TEACHER') {
      const classList = await ClassModel.findClassesByOwnerId(userId);
      classIds = classList.map(v => v.id);
    } else {
      classIds = await (await ClassMemberModel.getClassListByStudentId(userId)).map(v => v.classId);
    }
    let punchList = await PunchModel.getPunchListByClassIds(classIds);
    punchList = await Promise.all(punchList.map(async v => {
      const classVo = await ClassModel.findById(v.ClassId);
      // 获取班级成员
      const classMemberList = await (await ClassMemberModel.loadStudentListById(classVo.id)).map(vv => vv.studentId);
      const punchResultList = await PunchResultModel.findByPunchId(v.id);
      // 获取已打卡列表
      const punchedIdList = (punchResultList.filter(vv => !vv.isLeave)).map(vv => vv.studentId);
      // 获取请假列表
      const leaveIdList = punchResultList.filter(vv => vv.isLeave).map(vv => vv.studentId);
      // 获取未打卡人员列表
      const unPunchIdList = classMemberList.filter(vv => [...punchedIdList, ...leaveIdList].findIndex(vvv => vv === vvv) < 0);
      const res = {
        id: v.id,
        startTime: v.startTime,
        endTime: v.endTime,
        address: v.address,
        classVo,
        punchedNum: punchedIdList.length,
        leaveNum: leaveIdList.length,
        unPunchedNum: unPunchIdList.length,
      };
      return res;
    }))
    ctx.body = punchList;
  }
}

module.exports = PunchController;

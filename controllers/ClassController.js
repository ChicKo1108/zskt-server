const ApplyModel = require("../models/ApplyModel");
const ClassMemberModel = require("../models/ClassMemberModel");
const ClassModel = require("../models/ClassModel");
const commonUtils = require("../utils/commonUtils");

class ClassController {
  /**
   * 创建班级
   * @param {*} ctx
   */
  static async createClass(ctx) {
    const req = ctx.request.body;
    // TODO: 参数应增加importClassId，如果有值则邀请学生加入班级
    const { className, college, school, canSearch } = req;
    commonUtils.checkArguments(ctx, className);

    const { userId } = ctx.session;
    const result = await ClassModel.createClass(
      className,
      college,
      school,
      canSearch,
      userId
    );
    ctx.response.status = 200;
    ctx.body = {
      msg: "OK",
      data: result,
    };
  }

  /**
   * 根据Id查找班级
   * @param {*} ctx
   */
  static async findById(ctx) {
    const { id } = ctx.request.query;
    commonUtils.checkArguments(ctx, id);

    // 查找是否有班级
    const result = await ClassModel.findById(id);
    if (result) {
      ctx.response.status = 200;
      ctx.body = {
        msg: "OK",
        data: result,
      };
    } else {
      ctx.response.status = 200;
      ctx.body = {
        msg: "NOT_FOUND",
      };
    }
  }

  /**
   * 获取我的班级列表
   * @param {}} ctx
   */
  static async findMyClasses(ctx) {
    const { userId, role } = ctx.session;
    let classList;
    if (role === "TEACHER") {
      classList = (await ClassModel.findClassesByOwnerId(userId)) || [];
    } else if (role === "STUDENT") {
      const classIdList = (await ClassMemberModel.getClassListByStudentId(userId)).map(v => v.classId);
      classList = await ClassModel.findByIds(classIdList);
    }
    if (classList && classList.length) {
      ctx.response.status = 200;
      ctx.body = classList;
    } else {
      ctx.response.status = 200;
      ctx.body = [];
    }
  }

  // 根据班级名字或ID查找班级
  static async findClassByNameAndId (ctx) {
    const { role } = ctx.session;
    if (role !== 'STUDENT') {
      ctx.response.status = 200;
      ctx.body = "NO_AUTHORITY";
      return;
    }
    const { searchString } = ctx.request.query;
    commonUtils.checkArguments(ctx, searchString);
    const result = await ClassModel.findClassByNameAndId(searchString);
    ctx.response.status = 200;
    ctx.body = result;
  }

  static async apply2AddClass (ctx) {
    const { classId } = ctx.request.query;
    const { userId, role } = ctx.session;
    if (role !== 'STUDENT') {
      ctx.response.status = 200;
      ctx.body = "NO_AUTHORITY";
      return;
    }
    commonUtils.checkArguments(ctx, classId);
    // 判断是否已经加入班级了
    const hasJoined = await ClassMemberModel.findStuByClassId(classId, userId);
    if (hasJoined && hasJoined.id) {
      ctx.response.status = 200;
      ctx.body = "ALREADY_JOINED";
      return;
    }
    // 查询之前是否有申请，如果有申请且没处理则更新时间，否则重新添加记录
    const model = await ApplyModel.findByStuIdAndClassId(userId, classId);
    let result;
    if (model && model.id) {
      result = await ApplyModel.updateApply(userId, classId);
    } else {
      result = await ApplyModel.apply2AddClass(classId, userId);
    }
    ctx.response.status = 200;
    ctx.body = result;
  }

  // 处理申请
  static async handleApply (ctx) {
    const { studentId, classId, isPass } = ctx.request.query;
    commonUtils.checkArguments(ctx, studentId, classId, isPass);
    const { userId } = ctx.session;
    // 验证身份，用户是班级的班主任
    const classVo = await ClassModel.findById(classId);
    ctx.response.status = 200;
    if (userId !== classVo.ownerId) {
      ctx.body = "NO_AUTHORITY";
    } else {
      // 更新申请表状态;
      if (isPass === 'true') { // 如果通过则将学生加入到对应班级
        // 1. 先验证班级是否有学生
        const stuVo = ClassMemberModel.findStuByClassId(classId, studentId);
        if(stuVo.id) {
          // 已经存在该学生
          ctx.body = "ALREADY_JOINED_CLASS";
        } else {
          // 将学生加入到班级内
          const result = await Promise.all([ApplyModel.updateApplyPass(studentId, classId, true), ClassMemberModel.addClassMember(classId, studentId)]);
          ctx.body = result[0] && result[1].id;
        }
      } else {
        const result = await ApplyModel.updateApplyPass(studentId, classId, false);
        ctx.body = !!result[0];
      }
    }
  }
}

module.exports = ClassController;

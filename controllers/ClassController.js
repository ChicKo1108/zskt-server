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
        classList = await ClassModel.findClassesByOwnerId(userId) || [];
      } else if (role === "STUDENT") {
        const classIdList = await ClassModel.findClassesByStudentId(userId) || [];
        classList = classIdList.map(
          async (clsId) => await ClassModel.findById(clsId)
        );
      }
    //   TODO: fix bug
      /* for (let i = 0; i < classList.length; i++) {
          const cls = classList[i];
          cls.studentList = (await ClassModel.findClassMembers(cls.id)) || [];
          cls.a = 1;
      } */
      if (classList && classList.length) {
        ctx.response.status = 200;
        ctx.body = classList;
      } else {
        ctx.response.status = 200;
        ctx.body = [];
      }
  }
}

module.exports = ClassController;

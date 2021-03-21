const { Op } = require("sequelize");
const { Apply } = require("../schemas/index");

class ApplyModel {
  static async apply2AddClass(classId, studentId) {
    return await Apply.create({
      classId,
      studentId,
      isPass: "LOADING",
      applyTime: new Date(),
    });
  }

  static async getApplyList(classIds) {
    return await Apply.findAll({
      where: {
        classId: { [Op.in]: classIds },
        isPass: "LOADING",
      },
      order: [["updatedAt", "DESC"]],
    });
  }

  static async findByStuIdAndClassId(studentId, classId) {
    return await Apply.findOne({
      where: {
        studentId,
        classId,
        isPass: "LOADING",
      },
    });
  }

  static async updateApply(studentId, classId) {
    return await Apply.update(
      { applyTime: new Date() },
      {
        where: {
          studentId,
          classId,
          isPass: "LOADING",
        },
      }
    );
  }

  static async updateApplyPass(studentId, classId, isPass) {
    return await Apply.update(
      { isPass: isPass ? "PASS" : "REJECT" },
      {
        where: {
          studentId,
          classId,
          isPass: "LOADING",
        },
      }
    );
  }
}

module.exports = ApplyModel;

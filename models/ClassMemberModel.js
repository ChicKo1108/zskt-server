const { ClassMember } = require("../schemas/index");

class ClassMemberModel {
  static async loadStudentListById (classId) {
    return await ClassMember.findAll({ where: { classId } });
  }

  static async addClassMember (classId, studentId) {
    return await ClassMember.create({ classId, studentId });
  }

  static async findStuByClassId (classId, studentId) {
    return await ClassMember.findOne({ where: { classId, studentId } });
  }
  
  static async getClassListByStudentId (studentId) {
    return await ClassMember.findAll({ where: { studentId } });
  }
}

module.exports = ClassMemberModel;
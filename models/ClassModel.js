const { Op } = require("sequelize");
const { Class } = require("../schemas/index");
const ClassMemberModel = require("./ClassMemberModel");
const UserModel = require("./UserModel");

async function getStudentList (cls) {
  const { canSearch, className, college, school, id, createdAt, updatedAt, ownerId } = cls;
  const classMemberList = await ClassMemberModel.loadStudentListById(cls.id);
  const studentList = await Promise.all(classMemberList.map(async v => await UserModel.findUserById(v.studentId)));
  return { canSearch, className, college, school, id, createdAt, updatedAt, ownerId, studentList };
}
class ClassModel {
  static async findClassesByOwnerId(id) {
    const classList = await Class.findAll({
      where: { ownerId: id },
    });
    return await Promise.all(classList.map(async cls => await getStudentList(cls)));
  }

  static async createClass(className, college, school, canSearch, ownerId) {
    return await Class.create({
      className,
      ownerId,
      college,
      school, 
      canSearch,
    });
  }

  static async findById(id) {
    const cls =  await Class.findOne({
      where: { id },
    });
    return await getStudentList(cls);
  }

  static async findByIds(ids) {
    const classList =  await Class.findAll({
      where: {
        id: { [Op.in]: ids },
      },
    });
    return await Promise.all(classList.map(async cls => await getStudentList(cls)));
  }

  static async findClassOwner(classId) {
    return await Class.findOne({
      attributes: ["ownerId"],
      where: { classId },
    });
  }

  static async findClassByNameAndId(searchString) {
    return await Class.findAll({
      where: {
        [Op.or]: [
          { id: searchString },
          { className: { [Op.substring]: searchString } },
        ],
      },
    });
  }

}

module.exports = ClassModel;

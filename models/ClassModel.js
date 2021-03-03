const Class = require("../schemas/ClassSchema");
const ClassMember = require("../schemas/ClassMemberSchema");
class ClassModel {
    static async findClassesByOwnerId(id) {
        return await Class.findAll({
            where: { ownerId: id }
        })
    }

    static async createClass(className, college, school, canSearch, ownerId) {
        return await Class.create({ className, ownerId, college, school, canSearch });
    }

    static async findById (id) {
        return await Class.findOne({
            where: { id },
        })
    }

    static async findClassesByStudentId (studentId) {
        return await ClassMember.findAll({
            attributes: ['classId'],
            where: { studentId },
        })
    }

    static async findClassMembers (classId) {
        return await ClassMember.findAll({
            attributes: ['studentId'],
            where: { classId },
        })
    }

    static async findClassOwner (classId) {
        return await Class.findOne({
            attributes: ['ownerId'],
            where: { classId },
        })
    }
}

module.exports = ClassModel;
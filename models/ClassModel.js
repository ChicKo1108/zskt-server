const { Class, User } = require("../schemas/index");
class ClassModel {
    static async findClassesByOwnerId(id) {
        return await Class.findAll({
            where: { ownerId: id },
            include: {
                model: User,
                as: "studentList",
                attributes: ['id', 'avatar', 'sno', 'realName'],
            },
        })
    }

    static async findClassIdsByOwnerId (id) {
        return await Class.findAll({
            attributes: ['id'],
            where: { ownerId: id },
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

    static async findClassOwner (classId) {
        return await Class.findOne({
            attributes: ['ownerId'],
            where: { classId },
        })
    }
}

module.exports = ClassModel;
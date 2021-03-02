const Class = require("../schemas/ClassSchema");

Class.sync({ alter: true });

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

    static async findTeacherClasses (ownerId) {
        return await Class.findAll({
            where: { ownerId },
        })
    }
}

module.exports = ClassModel;
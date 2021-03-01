const Class = require("../schemas/ClassSchema");

Class.sync({ alter: true });

class ClassModel {
    static async findClassesByUserId(id) {
        return await Class.findAll({
            where: { ownerId: id }
        })
    }

    static async createClass(className, college, school, canSearch, ownerId) {
        return await Class.create({ className, ownerId, college, school, canSearch });
    }
}

module.exports = ClassModel;
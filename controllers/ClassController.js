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
        try {
            const { userId } = ctx.session;
            const result = await ClassModel.createClass(className, college, school, canSearch, userId);
            ctx.response.status = 200;
            ctx.body = {
                msg: "OK",
                data: result,
            }
        } catch (error) {
            ctx.response.status = 200;
            ctx.body = {
                msg: "FAIL",
            }
        }
    }

    /**
     * 根据Id查找班级
     * @param {*} ctx 
     */
    static async findById (ctx) {
        const req = ctx.request.query;
        const { id } = req;
        commonUtils.checkArguments(ctx, id);
        try {
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
                }
            }
        } catch (error) {
            
        }
    }

    static async findMyClasses (ctx) {
        const { userId } = ctx.session;
        const result = await ClassModel.findClassesByOwnerId(userId);
        if (result && result.length) {
            // TODO:
        }
    }
}

module.exports = ClassController;
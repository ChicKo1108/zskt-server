const ClassModel = require("../models/ClassModel");
const commonUtils = require("../utils/commonUtils");

class ClassController {
    static async createClass(ctx) {
        const req = ctx.request.body;
        const { className, college, school, canSearch } = req;
        commonUtils.checkArguments(ctx, className);
        try {
            const { userId } = ctx.session;
            const result = ClassModel.createClass(className, college, school, canSearch, userId);
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
}

module.exports = ClassController;
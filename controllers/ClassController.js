const ClassModel = require("../models/ClassModel");
const commonUtils = require("../utils/commonUtils");

class ClassController {
    static async createClass(ctx) {
        const req = ctx.request.body;
        const { className } = req;
        commonUtils.checkArguments(ctx, className);
        try {
            const result = ClassModel.createClass(className, id);
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
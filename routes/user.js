const Router = require("koa-router");
const UserController = require("../controllers/User");

const router = new Router({ prefix: "/api/user" });

router.post("/create", UserController.createUser);

module.exports = router;

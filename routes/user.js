const Router = require("koa-router");
const UserController = require("../controllers/UserController");

const router = new Router({ prefix: "/api/user" });

router.post("/create", UserController.createUser);
router.post("/login", UserController.login);

module.exports = router;

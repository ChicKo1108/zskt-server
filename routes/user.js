const Router = require("koa-router");
const UserController = require("../controllers/UserController");

const router = new Router({ prefix: "/api/user" });

router.post("/create", UserController.createUser);
router.post("/login", UserController.login);
router.post("/checkLogin", UserController.isLogin);
router.post("/updateUserInfo", UserController.updateUserInfo);
router.get("/getMyUserInfo", UserController.findMyUserInfo);
router.post("/checkPassword", UserController.checkPassword);
router.post("/updatePassword", UserController.updatePassword);

module.exports = router;

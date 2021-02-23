const Router = require("koa-router");

const router = new Router({ prefix: "/api/user" });

router.get("/getMyUser", async (ctx, next) => {
  ctx.body = "liHua";
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

module.exports = router;

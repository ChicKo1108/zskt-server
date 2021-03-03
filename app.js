const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaSession = require('koa-session');

// routes
const userRoute = require('./routes/user');
const classRoute = require('./routes/class');

const session_signed_key = ["zskt signed"];  // 这个是配合signed属性的签名key
const session_config = {
  key: 'koa:sess', /**  cookie的key。 (默认是 koa:sess) */
  maxAge: 1000 * 60 * 60 * 24,   /**  session 过期时间，以毫秒ms为单位计算 。*/
  autoCommit: true, /** 自动提交到响应头。(默认是 true) */
  overwrite: true, /** 是否允许重写 。(默认是 true) */
  httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
  signed: true, /** 是否签名。(默认是 true) */
  rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
  renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
};
const session = koaSession(session_config, app);
app.keys = session_signed_key;

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// session
app.use(session);

// 异常捕获
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      msessage: error.msessage,
    };
  }
})

app.use(async (ctx, next) => {
  if (ctx.path === '/api/user/login' || ctx.path === '/api/user/create') {
    await next();
  } else {
    if (!ctx.session.logged) {
      ctx.status = 403;
      ctx.body = "NOT_LOGIN";
    } else {
      await next();
    }
  }
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(userRoute.routes(), userRoute.allowedMethods())
app.use(classRoute.routes(), classRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

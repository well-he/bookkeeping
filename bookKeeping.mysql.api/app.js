const Koa = require('koa');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const router = require('koa-router')();
const cors = require('koa2-cors');

const log4js = require('./utils/logger');
const users = require('./routes/users');
const bills = require('./routes/bills');
const category = require('./routes/category');
const admin = require('./routes/admin')
const app = new Koa();
// error handler
onerror(app);

require('./config/db');

// middlewares
app.use(require('koa-static')(__dirname + '/public'));
app.use(cors());
app.use(json());
app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text'],
    })
);
// logger
app.use(async (ctx, next) => {
    await next();
    log4js.info(`${ctx.method} ${ctx.url} - ${ctx.response.status}`);
});

// routes
router.prefix('/api'); //一级路由
router.use(users.routes(), users.allowedMethods());
router.use(admin.routes(), admin.allowedMethods())
router.use(category.routes(), category.allowedMethods());
router.use(bills.routes(), bills.allowedMethods());
//挂载二级路由
app.use(router.routes(), router.allowedMethods());
// error-handling
app.on('error', (err) => {
    log4js.error(`${err.stack}`);
});
module.exports = app;

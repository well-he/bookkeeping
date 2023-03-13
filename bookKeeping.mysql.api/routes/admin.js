/**
 * 后台管理员管理模块
 */
const router = require('koa-router')();
const AdminController = require('../controller/adminController');
router.prefix('/admin');

router
    // .get('/', UserController.users)
    .put('/', AdminController.modify)
    .put('/password', AdminController.modifyPwd)
    .post('/login', AdminController.getUserByUserName)
    .post('/registry', AdminController.registry);

module.exports = router;

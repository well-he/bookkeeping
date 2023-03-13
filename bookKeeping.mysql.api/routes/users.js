/**
 * 用户管理模块
 */
const router = require('koa-router')();
const UserController = require('../controller/userController');
router.prefix('/users');

router
    .get('/', UserController.allUser)
    .get('/:username', UserController.findByUserName)
    .put('/', UserController.modify)
    .put('/password', UserController.modifyPwd)
    .post('/login', UserController.getUserByUserName)
    .post('/registry', UserController.registry)
    .delete('/:user_id',UserController.delete)

module.exports = router;

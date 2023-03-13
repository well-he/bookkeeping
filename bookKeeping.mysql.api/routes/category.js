/**
 * 分类管理模块
 */
const router = require('koa-router')();
const categoryController = require('../controller/categoryController.js');
router.prefix('/category');

router
    .get('/', categoryController.findAll)
    .get('/:category_id', categoryController.find)
    .post('/', categoryController.insert)
    .put('/', categoryController.update)
    .delete('/:category_id', categoryController.delete);

module.exports = router;

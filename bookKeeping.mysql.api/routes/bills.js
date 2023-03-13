/**
 * 账单管理模块
 */
const router = require('koa-router')();
const billController = require('../controller/billController.js');
router.prefix('/bills');

router
    .get('/', billController.findAll)
    .get('/u/:username', billController.findBillsByUserName)
    .get('/year/rank/:username', billController.getYearRank)
    .get('/month/rank/:username', billController.getMonthRank)
    .get('/week/:user_id', billController.getIncomeAndExpensesInWeek)
    .get('/mouth/:time/:user_id', billController.getIncomeAndExpensesInMouth)
    .get('/year/:user_id', billController.getIncomeAndExpensesInYear)
    .post('/week/total', billController.getWeekTotal)
    .post('/month/total', billController.getMonthTotal)
    .post('/year/total', billController.getYearTotal)
    .post('/c', billController.findBillsByCategoryId)
    .post('/t', billController.findByDate)
    .post('/', billController.record)
    .put('/', billController.Update)
    .delete('/:bill_id', billController.deleteRecord);

module.exports = router;

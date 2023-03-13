const Bill = require('../model/Bill');
class BillController {
    //记账
    static async record(ctx) {
        const { user_id, category_id, amount, date, note, bill_type } = ctx.request.body;
        const bill = new Bill(user_id, category_id, amount, date, note, bill_type);
        const res = await bill.insert();
        ctx.body = res;
    }
    //删除
    static async deleteRecord(ctx) {
        const { bill_id } = ctx.params;
        console.log(ctx.request);
        const res = await Bill.delete(bill_id);
        ctx.body = res;
    }
    //查询所有账单
    static async findAll(ctx) {
        const bills = await Bill.findAll();
        ctx.body = bills;
    }
    //根据日期查询所有账单
    static async findByDate(ctx) {
        const { date, user_id } = ctx.request.body;
        const bills = await Bill.findByDate(user_id, date);
        ctx.body = bills;
    }
    //查询用户的账单
    static async findBillsByUserName(ctx) {
        const { username } = ctx.params;
        const bills = await Bill.findByUserName(username);
        ctx.body = bills;
    }
    //查询某一分类的账单
    static async findBillsByCategoryId(ctx) {
        const { category_id } = ctx.request.body;
        const bills = await Bill.findByCategoryId(category_id);
        ctx.body = bills;
    }
    static async Update(ctx) {
        const { bill_id, user_id, amount, date, note } = ctx.request.body;
        const res = await Bill.update(bill_id, user_id, amount, date, note);
        ctx.body = res;
    }
    // 获取收入支出
    static async getIncomeAndExpensesInWeek(ctx) {
        const { user_id } = ctx.params;
        const bills = await Bill.getIncomeAndExpensesInWeek(user_id);
        ctx.body = bills;
    }
    static async getIncomeAndExpensesInMouth(ctx) {
        const { user_id, time } = ctx.params;
        const bills = await Bill.getIncomeAndExpensesInMouth(user_id, time);
        ctx.body = bills;
    }
    static async getIncomeAndExpensesInYear(ctx) {
        const { user_id } = ctx.params;
        const bills = await Bill.getIncomeAndExpensesInYear(user_id);
        ctx.body = bills;
    }
    static async getWeekTotal(ctx) {
        const { user_id } = ctx.request.body;
        const bills = await Bill.getWeekTotal(user_id);
        ctx.body = bills;
    }
    static async getMonthTotal(ctx) {
        const { user_id } = ctx.request.body;
        const bills = await Bill.getMonthTotal(user_id);
        ctx.body = bills;
    }
    static async getYearTotal(ctx) {
        const { user_id } = ctx.request.body;
        const bills = await Bill.getYearTotal(user_id);
        ctx.body = bills;
    }

    static async getYearRank(ctx) {
        const { username } = ctx.params;
        const bills = await Bill.getYearRank(username);
        ctx.body = bills;
    }
    static async getMonthRank(ctx) {
        const { username } = ctx.params;
        const bills = await Bill.getMonthRank(username);
        ctx.body = bills;
    }
}

module.exports = BillController;

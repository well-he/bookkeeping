const logger = require('../utils/logger');
const { exec } = require('../config/db');
const { success, fail } = require('../utils/util');

class Bill {
    constructor(user_id, category_id, amount, date, note, bill_type) {
        this.user_id = user_id;
        this.category_id = category_id;
        this.amount = amount;
        this.date = date;
        this.note = note;
        this.bill_type = bill_type;
    }

    static async findAll(username) {
        try {
            let sql =
                'select bill_id,amount,date,note,bill_type,category_name,category_icon,username from bill,category,user where bill.user_id = user.user_id and bill.category_id = category.category_id';
            const res = await exec(sql);
            if (res) {
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async findById(bill_id) {
        try {
            const res = await this.find(bill_id);
            if (res) {
                return success(res[0], '查询成功');
            }
            return fail('没有查询到当前账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async findByDate(user_id, time) {
        try {
            let t = time + '%';
            let sql = '';
            let res;
            if (user_id) {
                sql = `SELECT bill_id,
                            amount, date, note, bill_type, category_name, category_icon, username,user.user_id
                     FROM
                         USER, bill, category
                     WHERE
                         bill.user_id = USER.user_id
                       AND bill.category_id = category.category_id
                       AND bill.user_id = ?
                       AND bill.DATE LIKE ?`;
                res = await exec(sql, [user_id, t]);
            } else {
                sql = `SELECT bill_id,
                              amount, date, note, bill_type, category_name, category_icon, username,user.user_id
                       FROM
                           USER, bill, category
                       WHERE
                           bill.user_id = USER.user_id
                         AND bill.category_id = category.category_id
                         AND bill.DATE LIKE ?`;
                res = await exec(sql, [t]);
            }

            if (res) {
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async findByUserName(username) {
        try {
            let sql = `select bill_id,username,amount,note,bill_type,category_name,category_icon,date from bill,category,user 
            where bill.user_id = user.user_id and bill.category_id = category.category_id and username= ? AND YEARWEEK( DATE_FORMAT( bill.DATE, '%Y-%m-%d' ),1 ) = YEARWEEK(now(),1)`;
            const res = await exec(sql, [username]);
            if (res) {
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async findByCategoryId(user_id, category_id) {
        try {
            let sql =
                'select * from bill,category where bill.category_id = ? and bill.user_id = ? and bill.category_id = category.category_id';
            const res = await exec(sql, [category_id, user_id]);
            if (res) {
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getWeekTotal(user_id) {
        try {
            let sql = `SELECT DATE_FORMAT( bill.DATE, '%Y-%m-%d') AS DAY, bill.bill_type, sum( amount ) AS total FROM bill WHERE user_id = ? AND YEARWEEK( DATE_FORMAT( bill.DATE, '%Y-%m-%d' ),1 ) = YEARWEEK(now(),1) GROUP BY DAY,bill_type`;
            const res = await exec(sql, [user_id]);
            if (res) {
                let _eDays = [];
                let _eTotals = [];
                let _iDays = [];
                let _iTotals = [];
                for (let i of res) {
                    if (i.bill_type == 0) {
                        let md = i.DAY.split('-');
                        _eDays.push(`${md[1]}-${md[2]}`);
                        _eTotals.push(i.total);
                    } else {
                        let md = i.DAY.split('-');
                        _iDays.push(`${md[1]}-${md[2]}`);
                        _iTotals.push(i.total);
                    }
                }
                const obj = {
                    expenseDays: _eDays,
                    incomeDays: _iDays,
                    expenseTotals: _eTotals,
                    incomeTotals: _iTotals,
                };
                return success(obj, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getYearTotal(user_id) {
        try {
            let e_sql = `
            SELECT
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '1' THEN amount ELSE 0 END ), 1 ) AS 一月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '2' THEN amount ELSE 0 END ), 1 ) AS 二月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '3' THEN amount ELSE 0 END ), 1 ) AS 三月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '4' THEN amount ELSE 0 END ), 1 ) AS 四月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '5' THEN amount ELSE 0 END ), 1 ) AS 五月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '6' THEN amount ELSE 0 END ), 1 ) AS 六月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '7' THEN amount ELSE 0 END ), 1 ) AS 七月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '8' THEN amount ELSE 0 END ), 1 ) AS 八月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '9' THEN amount ELSE 0 END ), 1 ) AS 九月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '10' THEN amount ELSE 0 END ), 1 ) AS 十月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '11' THEN amount ELSE 0 END ), 1 ) AS 十一月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '12' THEN amount ELSE 0 END ), 1 ) AS 十二月 
            FROM bill 
            WHERE bill_type = 0 AND user_id = ? AND YEAR ( DATE )= YEAR ( CURRENT_DATE );`;
            const yearExpenses = await exec(e_sql, [user_id]);
            let i_sql = `
            SELECT
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '1' THEN amount ELSE 0 END ), 1 ) AS 一月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '2' THEN amount ELSE 0 END ), 1 ) AS 二月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '3' THEN amount ELSE 0 END ), 1 ) AS 三月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '4' THEN amount ELSE 0 END ), 1 ) AS 四月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '5' THEN amount ELSE 0 END ), 1 ) AS 五月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '6' THEN amount ELSE 0 END ), 1 ) AS 六月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '7' THEN amount ELSE 0 END ), 1 ) AS 七月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '8' THEN amount ELSE 0 END ), 1 ) AS 八月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '9' THEN amount ELSE 0 END ), 1 ) AS 九月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '10' THEN amount ELSE 0 END ), 1 ) AS 十月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '11' THEN amount ELSE 0 END ), 1 ) AS 十一月,
            TRUNCATE ( sum( CASE MONTH ( DATE ) WHEN '12' THEN amount ELSE 0 END ), 1 ) AS 十二月 
            FROM bill 
            WHERE bill_type = 1 AND user_id = ? AND YEAR ( DATE )= YEAR ( CURRENT_DATE );`;
            const yearincomes = await exec(i_sql, [user_id]);
            if (yearExpenses || yearincomes) {
                const res = {
                    yearExpenses: Object.values(yearExpenses[0]),
                    yearIncomes: Object.values(yearincomes[0]),
                };
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getMonthTotal(user_id) {
        try {
            let e_sql = `SELECT sum( CASE DAY( DATE) WHEN '1' THEN amount ELSE 0 END ) AS '1', sum( CASE DAY ( DATE ) WHEN '2' THEN amount ELSE 0 END ) AS '2', sum( CASE DAY ( DATE ) WHEN '3' THEN amount ELSE 0 END ) AS '3', sum( CASE DAY ( DATE ) WHEN '4' THEN amount ELSE 0 END ) AS '4', sum( CASE DAY ( DATE ) WHEN '5' THEN amount ELSE 0 END ) AS '5', sum( CASE DAY ( DATE ) WHEN '6' THEN amount ELSE 0 END ) AS '6', sum( CASE DAY ( DATE ) WHEN '7' THEN amount ELSE 0 END ) AS '7', sum( CASE DAY ( DATE ) WHEN '8' THEN amount ELSE 0 END ) AS '8', sum( CASE DAY ( DATE ) WHEN '9' THEN amount ELSE 0 END ) AS '9', sum( CASE DAY ( DATE ) WHEN '10' THEN amount ELSE 0 END ) AS '10', sum( CASE DAY ( DATE ) WHEN '11' THEN amount ELSE 0 END ) AS '11', sum( CASE DAY ( DATE ) WHEN '12' THEN amount ELSE 0 END ) AS '12', sum( CASE DAY ( DATE ) WHEN '13' THEN amount ELSE 0 END ) AS '13', sum( CASE DAY ( DATE ) WHEN '14' THEN amount ELSE 0 END ) AS '14', sum( CASE DAY ( DATE ) WHEN '15' THEN amount ELSE 0 END ) AS '15', sum( CASE DAY ( DATE ) WHEN '16' THEN amount ELSE 0 END ) AS '16', sum( CASE DAY ( DATE ) WHEN '17' THEN amount ELSE 0 END ) AS '17', sum( CASE DAY ( DATE ) WHEN '18' THEN amount ELSE 0 END ) AS '18', sum( CASE DAY ( DATE ) WHEN '19' THEN amount ELSE 0 END ) AS '19', sum( CASE DAY ( DATE ) WHEN '20' THEN amount ELSE 0 END ) AS '20', sum( CASE DAY ( DATE ) WHEN '21' THEN amount ELSE 0 END ) AS '21', sum( CASE DAY ( DATE ) WHEN '22' THEN amount ELSE 0 END ) AS '22', sum( CASE DAY ( DATE ) WHEN '23' THEN amount ELSE 0 END ) AS '23', sum( CASE DAY ( DATE ) WHEN '24' THEN amount ELSE 0 END ) AS '24', sum( CASE DAY ( DATE ) WHEN '25' THEN amount ELSE 0 END ) AS '25', sum( CASE DAY ( DATE ) WHEN '26' THEN amount ELSE 0 END ) AS '26', sum( CASE DAY ( DATE ) WHEN '27' THEN amount ELSE 0 END ) AS '27', sum( CASE DAY ( DATE ) WHEN '28' THEN amount ELSE 0 END ) AS '28', sum( CASE DAY ( DATE ) WHEN '29' THEN amount ELSE 0 END ) AS '29', sum( CASE DAY ( DATE ) WHEN '30' THEN amount ELSE 0 END ) AS '30', sum( CASE DAY ( DATE ) WHEN '31' THEN amount ELSE 0 END ) AS '31' FROM bill WHERE bill_type = 0 AND user_id = ? AND MONTH ( DATE )= MONTH ( CURRENT_DATE );`;
            let i_sql = `SELECT sum( CASE DAY( DATE) WHEN '1' THEN amount ELSE 0 END ) AS '1', sum( CASE DAY ( DATE ) WHEN '2' THEN amount ELSE 0 END ) AS '2', sum( CASE DAY ( DATE ) WHEN '3' THEN amount ELSE 0 END ) AS '3', sum( CASE DAY ( DATE ) WHEN '4' THEN amount ELSE 0 END ) AS '4', sum( CASE DAY ( DATE ) WHEN '5' THEN amount ELSE 0 END ) AS '5', sum( CASE DAY ( DATE ) WHEN '6' THEN amount ELSE 0 END ) AS '6', sum( CASE DAY ( DATE ) WHEN '7' THEN amount ELSE 0 END ) AS '7', sum( CASE DAY ( DATE ) WHEN '8' THEN amount ELSE 0 END ) AS '8', sum( CASE DAY ( DATE ) WHEN '9' THEN amount ELSE 0 END ) AS '9', sum( CASE DAY ( DATE ) WHEN '10' THEN amount ELSE 0 END ) AS '10', sum( CASE DAY ( DATE ) WHEN '11' THEN amount ELSE 0 END ) AS '11', sum( CASE DAY ( DATE ) WHEN '12' THEN amount ELSE 0 END ) AS '12', sum( CASE DAY ( DATE ) WHEN '13' THEN amount ELSE 0 END ) AS '13', sum( CASE DAY ( DATE ) WHEN '14' THEN amount ELSE 0 END ) AS '14', sum( CASE DAY ( DATE ) WHEN '15' THEN amount ELSE 0 END ) AS '15', sum( CASE DAY ( DATE ) WHEN '16' THEN amount ELSE 0 END ) AS '16', sum( CASE DAY ( DATE ) WHEN '17' THEN amount ELSE 0 END ) AS '17', sum( CASE DAY ( DATE ) WHEN '18' THEN amount ELSE 0 END ) AS '18', sum( CASE DAY ( DATE ) WHEN '19' THEN amount ELSE 0 END ) AS '19', sum( CASE DAY ( DATE ) WHEN '20' THEN amount ELSE 0 END ) AS '20', sum( CASE DAY ( DATE ) WHEN '21' THEN amount ELSE 0 END ) AS '21', sum( CASE DAY ( DATE ) WHEN '22' THEN amount ELSE 0 END ) AS '22', sum( CASE DAY ( DATE ) WHEN '23' THEN amount ELSE 0 END ) AS '23', sum( CASE DAY ( DATE ) WHEN '24' THEN amount ELSE 0 END ) AS '24', sum( CASE DAY ( DATE ) WHEN '25' THEN amount ELSE 0 END ) AS '25', sum( CASE DAY ( DATE ) WHEN '26' THEN amount ELSE 0 END ) AS '26', sum( CASE DAY ( DATE ) WHEN '27' THEN amount ELSE 0 END ) AS '27', sum( CASE DAY ( DATE ) WHEN '28' THEN amount ELSE 0 END ) AS '28', sum( CASE DAY ( DATE ) WHEN '29' THEN amount ELSE 0 END ) AS '29', sum( CASE DAY ( DATE ) WHEN '30' THEN amount ELSE 0 END ) AS '30', sum( CASE DAY ( DATE ) WHEN '31' THEN amount ELSE 0 END ) AS '31' FROM bill WHERE bill_type = 1 AND user_id = ? AND MONTH ( DATE )= MONTH ( CURRENT_DATE );`;
            const monthExpenses = await exec(e_sql, [user_id]);
            const monthIncomes = await exec(i_sql, [user_id]);
            if (monthExpenses || monthIncomes) {
                const res = {
                    monthExpenses: Object.values(monthExpenses[0]),
                    monthIncomes: Object.values(monthIncomes[0]),
                };
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getYearRank(username) {
        try {
            let sql = `SELECT bill_id, username, amount, bill_type, category_name, category_icon, DATE FROM bill, category, USER WHERE bill.user_id = USER.user_id AND bill.category_id = category.category_id AND username = ? AND YEAR( bill.DATE) = YEAR( now())`;
            const res = await exec(sql, [username]);
            if (res) {
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getMonthRank(username) {
        try {
            let sql = `SELECT bill_id, username, amount, bill_type, category_name, category_icon, DATE FROM bill, category, USER WHERE bill.user_id = USER.user_id AND bill.category_id = category.category_id AND username = 'admin' AND Month(bill.DATE) = Month (now())`;
            const res = await exec(sql, [username]);
            if (res) {
                return success(res, '查询成功');
            }
            return fail('没有查询到账单');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getIncomeAndExpensesInMouth(user_id, time) {
        try {
            let sql = `SELECT TRUNCATE ( SUM( CASE WHEN bill_type = 1 THEN amount ELSE 0 END ), 1 ) AS income,
            TRUNCATE ( SUM( CASE WHEN bill_type = 0 THEN amount ELSE 0 END ), 1 ) AS expense FROM bill 
            WHERE user_id = ? AND DATE_FORMAT( DATE, '%Y-%m' )=DATE_FORMAT( ?, '%Y-%m' )`;
            const res = await exec(sql, [user_id, time, time]);
            if (!res) {
                return fail('失败!');
            }
            return success(res[0], '成功');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getIncomeAndExpensesInWeek(user_id) {
        try {
            let sql = `SELECT SUM( CASE WHEN bill_type = 1 THEN amount ELSE 0 END) AS income, SUM( CASE WHEN bill_type = 0 THEN amount ELSE 0 END ) AS expense FROM bill WHERE user_id = ? AND yearweek( DATE, 1 )= yearweek ( CURRENT_DATE (), 1 );`;
            const res = await exec(sql, [user_id]);
            if (!res) {
                return fail('失败!');
            }
            return success(res[0], '成功');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async getIncomeAndExpensesInYear(user_id) {
        try {
            let sql = `SELECT SUM( CASE WHEN bill_type = 1 THEN amount ELSE 0 END) AS expense, SUM( CASE WHEN bill_type = 0 THEN amount ELSE 0 END ) AS income FROM bill WHERE user_id = ? AND YEAR( DATE )= YEAR ( CURRENT_DATE ());`;
            const res = await exec(sql, [user_id]);
            if (!res) {
                return fail('失败!');
            }
            return success(res[0], '成功');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async delete(bill_id) {
        try {
            const bill = await this.find(bill_id);
            if (bill) {
                let sql = 'delete from bill where bill_id = ?';
                const res = await exec(sql, [bill_id]);
                if (res) {
                    return success(bill, '删除成功');
                }
            }
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async update(bill_id, user_id, amount, date, note) {
        try {
            let sql = 'UPDATE bill SET user_id = ?, amount = ?,date = ?,note = ? where bill_id = ?';
            const res = await exec(sql, [user_id, amount, date, note, bill_id]);

            if (!res) {
                return fail('更新失败!');
            }
            return success('ok', '成功更新');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    async insert() {
        try {
            let sql =
                'INSERT INTO bill SET user_id = ?, category_id = ?, amount = ?,date = ?,note = ?,bill_type = ?';

            const res = await exec(sql, [
                this.user_id,
                this.category_id,
                this.amount,
                this.date,
                this.note,
                this.bill_type,
            ]);

            if (!res) {
                return fail('添加失败!');
            }
            return success(this, '添加成功');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async find(bill_id) {
        try {
            let sql = 'select * from bill where bill_id = ?';
            const res = await exec(sql, [bill_id]);
            if (res) {
                return res;
            }
            return null;
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }
}

module.exports = Bill;

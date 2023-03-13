/**
 * 数据库连接
 */
const mysql = require('mysql');
const config = require('./index');
const logger = require('../utils/logger');

const db = mysql.createConnection(config.connectionStr);

db.connect(err => {
    if (err) {
        logger.error('数据库连接失败 ' + err.stack);
        return;
    }
    logger.info('数据库连接成功');
});

/**
 * 把 SQL 提交给数据库。
 * @param { string } sql sql语句
 * @param { array } params 需要的参数，数组形式
 * @returns Promise
 */
function exec(sql, params = []) {
    const myPromise = new Promise((resolve, reject) => {
        // 把SQL语句提交给数据库执行，然后等待回调
        let res = db.query(sql, params, (err, res, fields) => {
            if (err) {
                //失败
                reject(err);
                return;
            }
            resolve(res);
        });
        logger.info(res.sql);
    });
    return myPromise;
}

module.exports = { db, exec };

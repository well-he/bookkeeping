/**
 * 用户实体
 */

const crypto = require('crypto');

const {exec} = require('../config/db');
const logger = require('../utils/logger');
const {success, fail} = require('../utils/util');

class User {
    constructor(username, password, email, phone) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }

    static async login(username, password) {
        try {
            const res = await exec('SELECT * FROM user WHERE  username = ?', [username]);
            if (res.length === 0) {
                return fail('用户未找到');
            }
            const hash = md5(password);
            if (res[0].password !== hash) {
                return fail('密码不正确');
            }
            return success(res[0], '登录成功');
        } catch (error) {
            logger.error(`登录出错: ${error}`);
            throw error;
        }
    }

    async registry() {
        try {
            if ((await this.findone(this.username)) !== 0) {
                return fail('当前帐号已被注册');
            }
            await exec('INSERT INTO user SET username=?,password=?,email=?,phone=?', [
                this.username,
                md5(this.password),
                this.email,
                this.phone,
            ]);

            const user = await this.findone(this.username);
            return success(user, '注册成功');
        } catch (error) {
            logger.error(`注册出错: ${error}`);
            throw error;
        }
    }

    static async delete(user_id) {
        try {
            let sql = 'delete from user where user_id = ?';
            const res = await exec(sql, [user_id]);
            if (res) {
                return success(res, '删除成功');
            }
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    async modify() {
        try {
            let sql = 'UPDATE User SET username = ?, password = ?, email = ?, phone = ? WHERE username = ?'
            let param = []
            const user = await this.findone(this.username);
            if (user.password == md5(this.password)) {
                param = [this.username, this.password, this.email, this.phone, this.username]
            } else {
                param = [this.username, md5(this.password), this.email, this.phone, this.username]
            }
            const res = await exec(sql, param);
            if (res) {
                return success(res, '删除成功');
            }
            return success(user, '修改成功');
        } catch (error) {
            logger.error(`修改出错: ${error}`);
            throw error;
        }
    }

    async modifyPwd(password) {
        try {
            const user = await this.findone(this.username);
            if (md5(password) === user.password) {
                return fail('新旧密码不能相同');
            }
            await exec('UPDATE User SET username = ?, password = ? WHERE username = ?', [
                this.username,
                md5(password),
                this.username,
            ]);
            return success(user, '修改成功');
        } catch (error) {
            logger.error(`修改出错: ${error}`);
            throw error;
        }
    }

    static async findAll() {
        try {
            let sql = `SELECT * FROM user`

            const res = await exec(sql);
            if (res.length === 0) {
                return fail('当前无用户!');
            }
            return success(res, "查询成功");
        } catch (err) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    async findone(username) {
        try {
            const res = await exec('SELECT * FROM user WHERE username = ?', [username]);
            if (res.length === 0) {
                return 0;
            }
            return res[0];
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }

    static async findByUserName(username) {
        try {
            let name = `%${username}%`;
            const res = await exec('SELECT * FROM user WHERE username LIKE  ?', [name]);
            if (res.length === 0) {
                return fail('请检查是否有该用户!');
                ;
            }
            return success(res, "查询成功");
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }
}

function md5(string) {
    // 规定使用哈希算法中的MD5算法
    const hash = crypto.createHash('md5');

    // 可任意多次调用update(),效果相当于多个字符串相加
    hash.update(string);

    //hash.digest('hex')表示输出的格式为16进制
    return hash.digest('hex');
}

module.exports = User;

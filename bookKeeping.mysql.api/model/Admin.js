/**
 * 用户实体
 */
const crypto = require('crypto');
const {
    exec
} = require('../config/db');
const logger = require('../utils/logger');
const {
    success,
    fail
} = require('../utils/util');

class Admin {
    constructor(username, password, email, phone) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }

    static async login(admin_name, admin_password) {
        try {
            const res = await exec('SELECT * FROM admin WHERE  admin_name = ?', [admin_name]);
            if (res.length === 0) {
                return fail('用户未找到');
            }
            const hash = md5(admin_password);
            if (res[0].admin_password !== hash) {
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
            await exec('INSERT INTO admin SET admin_name=?,admin_password=?,admin_email=?,admin_phone=?', [
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

    async modify() {
        try {
            await exec(
                'UPDATE admin SET admin_name = ?, admin_password = ?, admin_email = ?, admin_phone = ? WHERE admin_name = ?',
                [this.username, md5(this.password), this.email, this.phone, this.username]
            );
            const user = await this.findone(this.username);
            return success(user, '修改成功');
        } catch (error) {
            logger.error(`修改出错: ${error}`);
            throw error;
        }
    }

    async modifyPwd(admin_password) {
        try {
            const user = await this.findone(this.username);
            if (md5(admin_password) === user.password) {
                return fail('新旧密码不能相同');
            }
            await exec('UPDATE admin SET admin_name = ?, admin_password = ? WHERE admin_name = ?', [
                this.username,
                md5(admin_password),
                this.username,
            ]);
            return success(user, '修改成功');
        } catch (error) {
            logger.error(`修改出错: ${error}`);
            throw error;
        }
    }

    async findone(admin_name) {
        try {
            const res = await exec('SELECT * FROM admin WHERE admin_name = ?', [admin_name]);
            if (res.length === 0) {
                return 0;
            }
            return res[0];
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

module.exports = Admin;

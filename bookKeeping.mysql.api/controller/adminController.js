const Admin = require('../model/Admin');

class AdminController {
    //登录
    static async getUserByUserName(ctx) {
        const {admin_name, admin_password} = ctx.request.body;
        const user = await Admin.login(admin_name, admin_password);
        ctx.body = user;
    }

    //注册
    static async registry(ctx) {
        const {admin_name, admin_password, admin_email, admin_phone} = ctx.request.body;
        let admin = new Admin(admin_name, admin_password, admin_email, admin_phone);
        const res = await admin.registry();
        ctx.body = res;
    }

    //修改密码
    static async modifyPwd(ctx) {
        const {admin_name, admin_password} = ctx.request.body;
        let admin = new Admin(admin_name);
        const res = await admin.modifyPwd(admin_password);
        ctx.body = res;
    }

    //编辑信息
    static async modify(ctx) {
        const {userName, userPwd, email, phone} = ctx.request.body;
        let admin = new Admin(userName, userPwd, email, phone);
        const res = await admin.modify();
        ctx.body = res;
    }
}

module.exports = AdminController;

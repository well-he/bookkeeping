const User = require('../model/User');
class UserController {
    //登录
    static async getUserByUserName(ctx) {
        const { userName, userPwd } = ctx.request.body;
        const user = await User.login(userName, userPwd);
        ctx.body = user;
    }
    //注册
    static async registry(ctx) {
        const { userName, userPwd, email, phone } = ctx.request.body;
        let user = new User(userName, userPwd, email, phone);
        const res = await user.registry();
        ctx.body = res;
    }

    //修改密码
    static async modifyPwd(ctx) {
        const { userName, userPwd } = ctx.request.body;
        let user = new User(userName);
        const res = await user.modifyPwd(userPwd);
        ctx.body = res;
    }

    //编辑信息
    static async modify(ctx) {
        const { userName, userPwd, email, phone } = ctx.request.body;
        let user = new User(userName, userPwd, email, phone);
        const res = await user.modify();
        ctx.body = res;
    }
    //
    static async findByUserName(ctx){
        const {username} = ctx.params;
        let users = await User.findByUserName(username);
        ctx.body = users;
    }

    static async delete(ctx){
        const {user_id} = ctx.params;
        let users = await User.delete(user_id);
        ctx.body = users;
    }
    static async allUser(ctx){
        const users = await User.findAll();
        ctx.body = users;
    }
}

module.exports = UserController;

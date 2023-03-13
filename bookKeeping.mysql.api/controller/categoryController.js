const Category = require('../model/Category');

class categrayController {
    static async findAll(ctx) {
        const res = await Category.findAll();
        ctx.body = res;
    }
    static async find(ctx) {
        const { category_id } = ctx.params;
        console.log(ctx.params);
        const res = await Category.find(category_id);
        ctx.body = res;
    }
    static async insert(ctx) {
        const { category_name, category_type, category_icon } = ctx.request.body;
        const category = new Category(category_name, category_type, category_icon);
        ctx.body = await category.insert();
    }
    static async update(ctx) {
        const { category_id, category_name, category_type, category_icon } = ctx.request.body;
        ctx.body = await Category.update(category_id, category_name, category_type, category_icon);
    }
    static async delete(ctx) {
        const { category_id } = ctx.params;
        ctx.body = await Category.delete(category_id);
    }
}

module.exports = categrayController;

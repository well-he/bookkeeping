const logger = require('../utils/logger');
const { exec } = require('../config/db');
const { success, fail } = require('../utils/util');

class Category {
    constructor(category_name, category_type, category_icon) {
        this.category_name = category_name;
        this.category_type = category_type;
        this.category_icon = category_icon;
    }

    static async find(id) {
        try {
            const res = await exec('SELECT * FROM category WHERE  category_id = ?', [id]);
            if (res) {
                return success(res[0], '查询成功');
            }

            return fail('没有当前分类');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }
    static async findAll() {
        try {
            const res = await exec('SELECT * FROM category WHERE  1 = 1');
            if (res.length === 0) {
                return fail('没有分类');
            }

            return success(res, '查询成功');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }
    static async delete(id) {
        try {
            const res = await exec('DELETE from category where category_id = ?', [id]);
            if (!res) {
                return fail('删除失败!');
            }
            return success('ok', '已删除');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }
    static async update(id, category_name, category_type, category_icon) {
        try {
            const res = await exec(
                'UPDATE category SET category_name = ?, category_type = ?, category_icon = ? WHERE category_id = ?',
                [category_name, category_type, category_icon, id]
            );

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
            const res = await exec(
                'INSERT INTO category SET category_name=?,category_type=?,category_icon=?',
                [this.category_name, this.category_type, this.category_icon]
            );

            if (!res) {
                return fail('添加失败!');
            }
            return success('ok', '新增成功');
        } catch (error) {
            logger.error(`出错: ${error}`);
            throw error;
        }
    }
    
}
module.exports = Category;

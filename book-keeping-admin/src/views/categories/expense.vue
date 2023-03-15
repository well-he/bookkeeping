<template>
    <div class="categoies">
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="addShow = true">添加新分类</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-table :data="state.expenses" border class="table" style="height: 700px">
            <el-table-column fixed prop="category_id" label="ID" />
            <el-table-column label="图标">
                <template #default="scope">
                    <my-icon :icon="scope.row.category_icon" />
                </template>
            </el-table-column>
            <el-table-column prop="category_name" label="图标名称"></el-table-column>
            <el-table-column label="分类">
                <template #default="scope">
                    <span>
                        <el-tag class="mx-1" size="large">支出</el-tag>
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button type="primary" @click="showEdit(scope.row)">编辑</el-button>
                    <el-popconfirm
                        width="220"
                        placement="left"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        icon-color="#626AEF"
                        title="确认删除吗?"
                        @confirm="del(scope.row)"
                    >
                        <template #reference>
                            <el-button type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="addShow" title="添加分类">
            <el-form
                label-position="top"
                label-width="100px"
                :model="newCategory"
                :rules="rules"
                ref="form"
            >
                <el-form-item label="分类名" prop="category_name">
                    <el-input v-model="newCategory.category_name" />
                </el-form-item>
                <el-form-item label="分类图标" prop="category_icon">
                    <el-radio-group v-model="newCategory.category_icon" size="large">
                        <el-radio-button v-for="icon in state.icons" :label="icon">
                            <my-icon :icon="icon" />
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" @click="add(form)">确定</el-button>
                    <el-button type="warning" size="large" @click="addShow = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-drawer v-model="drawer" title="编辑分类" direction="rtl">
            <el-form label-position="top" label-width="100px" ref="editForm" :model="editCategory">
                <el-form-item label="分类图标" prop="category_icon">
                    <my-icon :icon="editCategory.category_icon" />
                </el-form-item>
                <el-form-item label="分类名" prop="category_name">
                    <el-input v-model="editCategory.category_name" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" @click="edit(editForm)">确定</el-button>
                    <el-button type="warning" size="large" @click="drawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import myIcon from '@/components/myIcon.vue';
import api from '@/api';
//
const state = reactive({
    expenses: [],
    icons: [],
});
const drawer = ref(false);
const addShow = ref(false);
const form = ref();
const editForm = ref();
const newCategory = reactive({
    category_name: '',
    category_type: '',
    category_icon: '',
});
const editCategory = reactive({
    category_id: '',
    category_name: '',
    category_type: '',
    category_icon: '',
});
const rules = reactive({
    category_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    category_icon: [
        {
            required: true,
            message: '请选择分类图标',
            trigger: 'change',
        },
    ],
});
//

const showEdit = c => {
    drawer.value = true;
    editCategory.category_id = c.category_id;
    editCategory.category_name = c.category_name;
    editCategory.category_type = c.category_type;
    editCategory.category_icon = c.category_icon;
};
const edit = async c => {
    const res = await api.category.update(editCategory);
    if (res) {
        ElMessage.success('修改成功');
        await getCategories();
        drawer.value = false;
    } else {
        ElMessage.error('修改失败,请检查服务器状态!');
    }
};

const add = async f => {
    await f.validate((valid, fields) => {
        if (valid) {
            ElMessage.success('添加成功');
            addShow.value = false;
        }
    });
};

const del = async c => {
    console.log(c);
    const res = await api.category.delete(c.category_id);
    if (res) {
        ElMessage.success('删除成功');
    } else {
        ElMessage.error('删除失败,请检查服务器状态!');
    }
    getCategories();
};

const getCategories = async () => {
    const data = await api.category.findAll();
    await setData(data);
};

const setData = async data => {
    state.expenses = data.filter(c => c.category_type == 'expenses');
    state.icons = data.map(c => c.category_icon);
};
onMounted(async () => {
    await getCategories();
});
</script>

<style lang="scss" scoped>
.categoies {
    padding: 20px;

    .icons {
    }
}
</style>

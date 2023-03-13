<template>
    <div class="categoies">
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="showAdd">添加新分类</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-tabs type="border-card">
            <el-tab-pane label="支出">
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
            </el-tab-pane>
            <el-tab-pane label="收入">
                <el-table :data="state.incomes" border class="table" style="height: 700px">
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
                                <el-tag class="mx-1" size="large" type="success">收入</el-tag>
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
            </el-tab-pane>
        </el-tabs>

        <el-dialog
            v-model="dialogShow"
            :title="dialogTitle"
            width="70%"
            align-center
            @close="resetForm"
        >
            <el-form label-position="top" :model="newCategory">
                <el-form-item label="图标" prop="category_icon">
                    <el-col class="icons">
                        <el-input v-model.trim="newCategory.category_icon" style="display: none" />
                        <el-button-group>
                            <el-button
                                v-for="n in state.categories"
                                @click="newCategory.category_icon = n"
                            >
                                <my-icon :icon="n.category_icon" />
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-form-item>
                <el-form-item label="分类名" prop="category_name">
                    <el-col :span="16">
                        <el-input v-model.trim="newCategory.category_name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="类型" prop="category_type">
                    <el-radio-group v-model="newCategory.category_type">
                        <el-radio label="expenses" size="large" border>支出</el-radio>
                        <el-radio label="income" size="large" border>收入</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogShow = false">取消</el-button>
                    <el-button type="primary" @click="opreate">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { ElMessage } from 'element-plus';
import myIcon from '@/components/myIcon.vue';
import api from '@/api';
//
const state = reactive({
    categories: [],
    incomes: [],
    expenses: [],
    icons: [],
});
const newCategory = reactive({
    category_id: '',
    category_name: '',
    category_type: '',
    category_icon: '',
});

const dialogShow = ref(false);
const dialogTitle = ref('添加分类');

//
const showAdd = () => {
    dialogShow.value = true;
    dialogTitle.value = '添加分类';
    resetForm();
};

const showEdit = c => {
    dialogShow.value = true;
    dialogTitle.value = '编辑';
    newCategory.category_id = c.category_id;
    newCategory.category_icon = c.category_icon;
    newCategory.category_name = c.category_name;
    newCategory.category_type = c.category_type;
};
const resetForm = () => {
    newCategory.category_icon = '';
    newCategory.category_name = '';
    newCategory.category_type = '';
};
const edit = async c => {
    const res = await api.category.update(newCategory);
    if (res) {
        ElMessage.success('修改成功');
        dialogShow.value = false;
    } else {
        ElMessage.error('修改失败,请检查服务器状态!');
    }
};
const addNewCategory = async () => {
    const res = await api.category.insert(newCategory);
    if (res) {
        ElMessage.success('添加成功');
        dialogShow.value = false;
    } else {
        ElMessage.error('添加失败,请检查服务器状态!');
    }
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

const opreate = async () => {
    if (dialogTitle.value == '添加分类') {
        await addNewCategory();
    } else {
        await edit();
    }
    getCategories();
};
const getCategories = async () => {
    const data = await api.category.findAll();
    await setData(data);
};
const setData = async data => {
    state.categories = data;
    state.incomes = data.filter(c => c.category_type == 'income');
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

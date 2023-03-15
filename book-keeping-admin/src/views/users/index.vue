<template>
    <div class="users">
        <el-row>
            <el-col>
                <el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="查询用户">
                        <el-input v-model="query.username" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="findUser">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAdd">添加新用户</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="tableData" border class="table">
            <el-table-column fixed prop="user_id" label="用户ID" width="120" />
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="password" label="密码(MD5 32位加密)"></el-table-column>
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column label="操作" width="240">
                <template #default="scope">
                    <el-button type="primary" @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="deleteUser(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            background
            layout="prev, pager, next,total,->"
            :total="state.users.length"
            v-model:current-page="state.currentPage"
            @update:current-page="sizeChange"
        />

        <el-dialog
            v-model="dialogShow"
            :title="dialogTitle"
            width="500"
            align-center
            :rules="rules"
            @close="resetForm"
        >
            <el-form label-position="top" :model="newUser" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input
                        v-model.trim="newUser.username"
                        :disabled="dialogTitle == '编辑用户'"
                    />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model.trim="newUser.password" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model.trim="newUser.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model.trim.number="newUser.phone" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogShow = false">取消</el-button>
                    <el-button type="primary" @click="operator">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import api from '@/api';
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
//
const state = reactive({
    users: [],
    currentPage: 1,
});
const newUser = reactive({
    username: '',
    password: '',
    email: '',
    phone: '',
});

const checkEmail = (rule, value, cb) => {
    //验证邮箱的正则表达式
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
    }
    cb(new Error('请输入合法的邮箱'));
};

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, message: '用户名长度最低为5', trigger: 'blur' },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入你的邮箱', trigger: 'blur' },
        {
            validator: checkEmail,
            min: 6,
            max: 18,
            message: '邮箱格式错误',
            trigger: 'blur',
        },
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '手机号应为11位', trigger: 'blur' },
    ],
};
const query = reactive({
    username: '',
});
const tableData = ref([]);
const dialogShow = ref(false);
const dialogTitle = ref('添加用户');
//
const getUsers = async () => {
    const res = await api.users.allUser();
    if (res) {
        displayData(res);
    }
};
const sizeChange = v => {
    let start = 10 * (v - 1);
    let end = state.currentPage * 10;
    tableData.value = state.users.slice(start, end);
};

const deleteUser = u => {
    ElMessageBox.confirm('确定要删除吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    })
        .then(async () => {
            const delRes = await api.users.delete(u.user_id);
            console.log(delRes);
            if (delRes) {
                ElMessage.success('删除成功!');
                getUsers();
            }
        })
        .catch(err => {});
};

const findUser = async () => {
    const res = await api.users.findByUserName(query.username);
    if (res) {
        displayData(res);
    }
};
const addNewUser = async () => {
    const res = await api.users.addNewUser({
        userName: newUser.username,
        userPwd: newUser.password,
        email: newUser.email,
        phone: newUser.phone,
    });
    if (res) {
        ElMessage.success('添加成功');
        dialogShow.value = false;
    } else {
        ElMessage.error('添加失败,请检查服务器状态!');
    }
};
const showAdd = async u => {
    dialogTitle.value = '添加用户';
    dialogShow.value = true;
    resetForm();
};

const showEdit = async u => {
    dialogTitle.value = '编辑用户';
    dialogShow.value = true;
    newUser.username = u.username;
    newUser.password = u.password;
    newUser.email = u.email;
    newUser.phone = u.phone;
};

const resetForm = () => {
    newUser.username = '';
    newUser.password = '';
    newUser.email = '';
    newUser.phone = '';
};
const edit = async () => {
    const res = await api.users.modify({
        userName: newUser.username,
        userPwd: newUser.password,
        email: newUser.email,
        phone: newUser.phone,
    });
    if (res) {
        ElMessage.success('修改成功');
        dialogShow.value = false;
    } else {
        ElMessage.error('修改失败,请检查服务器状态!');
    }
};
const operator = async () => {
    if (dialogTitle.value == '编辑用户') {
        await edit();
    } else {
        await addNewUser();
    }
    getUsers();
};
const displayData = data => {
    state.users = data;
    let start = 10 * (state.currentPage - 1);
    let end = state.currentPage * 10;
    tableData.value = state.users.slice(start, end);
};

onMounted(() => {
    getUsers();
});
</script>

<style lang="scss" scoped>
.users {
    padding: 20px;
    position: relative;
    .table {
        margin: auto;
    }
    .pager {
        margin-top: 20px;
        justify-content: flex-end;
    }
}
</style>

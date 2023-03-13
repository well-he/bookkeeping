<script setup>
import { View, User, Message, Phone } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import api from '@/api';
import storage from '@/utils/storage';

const router = useRouter();
const store = useStore();
const isRegistry = ref(false);
const logined = ref(false);
const userForm = ref();

const user = reactive({
    admin_name: '',
    admin_password: '',
    admin_email: '',
    admin_phone: '',
});

const rules = {
    admin_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    admin_password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' },
    ],
    admin_email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    admin_phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请输入11位的手机号', trigger: 'blur' },
    ],
};

const successTip = () => {
    ElMessage({
        message: `登录成功`,
        type: 'success',
    });
};

const login = () => {
    userForm.value.validate(async valid => {
        if (valid) {
            const res = await api.users.login(user);
            if (res) {
                successTip();
                store.saveUserInfo(res);
                storage.setItem('userinfo', res);
                router.push('/system');
            }
        }
    });
};

function createAccount() {
    userForm.value.validate(async valid => {
        if (valid) {
            const res = await api.users.registry(user);
            store.saveUserInfo(res);
        }
    });
}

const registry = () => {
    isRegistry.value = true;
    createAccount();
};
</script>

<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form ref="userForm" :model="user" :rules="rules">
                <h1 class="title">后台管理系统</h1>
                <el-form-item prop="admin_name">
                    <el-input
                        type=""
                        :prefix-icon="User"
                        v-model.trim="user.admin_name"
                        placeholder="请输入用户名"
                    />
                </el-form-item>
                <el-form-item prop="admin_password">
                    <el-input
                        type="password"
                        :prefix-icon="View"
                        v-model.trim="user.admin_password"
                        placeholder="请输入密码"
                    />
                </el-form-item>
                <el-form-item prop="admin_email" v-if="isRegistry">
                    <el-input
                        type="text"
                        :prefix-icon="Message"
                        v-model.trim="user.admin_email"
                        placeholder="请输入注册邮箱"
                    />
                </el-form-item>
                <el-form-item prop="admin_phone" v-if="isRegistry">
                    <el-input
                        type="text"
                        :prefix-icon="Phone"
                        v-model.trim="user.admin_phone"
                        placeholder="请输入注册手机号"
                    />
                </el-form-item>
                <el-form-item>
                    <div v-if="isRegistry">
                        <el-button type="primary" @click="createAccount">确认注册</el-button>
                        <el-button type="success" @click="isRegistry = false">返回登录</el-button>
                    </div>
                    <div class="btn-group" v-else>
                        <el-button type="primary" size="large" :loading="logined" @click="login">
                            登录
                        </el-button>
                        <el-button type="success" size="large" @click="registry">注册</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss">
.login-wrapper {
    width: 100vw;
    height: 100vh;
    background: #64a5e2;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-image: url('../assets/images/loginbg.jpg');
    .modal {
        width: 500px;
        padding: 50px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

        .title {
            font-size: 2.5rem;
            line-height: 1.5;
            text-align: center;
            margin-bottom: 30px;
        }
    }
}
</style>

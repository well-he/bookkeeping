<template>
    <div class="login">
        <div class="navbar">
            <h2>记账本</h2>
        </div>
        <van-form @submit="onSubmit">
            <van-cell-group inset title="用户注册">
                <van-field
                    v-model="userInfo.userName"
                    name="用户名"
                    label="用户名"
                    placeholder="请输入用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-model="userInfo.userPwd"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
                <van-field
                    v-model="userInfo.phone"
                    type="tel"
                    name="手机号"
                    label="手机号"
                    placeholder="请输入手机号"
                    :rules="[
                        {
                            required: true,
                            message: '请填写手机号',
                        },
                        { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！' },
                    ]"
                />
                <van-field
                    v-model="userInfo.email"
                    name="邮箱"
                    label="邮箱"
                    placeholder="请输入邮箱"
                    :rules="[
                        {
                            required: true,
                            message: '请填写邮箱',
                        },
                        {
                            pattern:
                                /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                            message: '邮箱格式错误！',
                        },
                    ]"
                />
            </van-cell-group>
            <div style="margin: 16px">
                <van-button round block color="#e0f0e9" style="color: #1989fa" native-type="submit">
                    确认注册
                </van-button>
            </div>
            <div class="login">
                <router-link to="/login">已有账号|去登录</router-link>
            </div>
        </van-form>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiUser from '@/api/user';
import useStorage from '@/utils/storage';
import { useStore } from '@/store';
export default {
    setup() {
        const router = useRouter();
        const storage = useStorage();
        const store = useStore();
        const onSubmit = async () => {
            const res = await apiUser.registry(userInfo);
            if (res) {
                storage.setItem('userInfo', res);
                store.saveUser(res);
                router.push('/detail');
            }
        };

        const userInfo = reactive({
            userName: '',
            userPwd: '',
            phone: '',
            email: '',
        });
        return { onSubmit, userInfo };
    },
};
</script>

<style lang="scss" scoped>
.login {
    .navbar {
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #e0f0e9;
    }
    .login {
        padding: 0 20px;
        float: right;
    }
}
</style>

<template>
    <div class="login">
        <div class="navbar">
            <h2>记账本</h2>
        </div>
        <van-form @submit="onSubmit">
            <van-cell-group inset title="用户登录">
                <van-field
                    v-model="userInfo.userName"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-model="userInfo.userPwd"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
            </van-cell-group>
            <div style="margin: 16px">
                <van-button round block color="#e0f0e9" style="color: #1989fa" native-type="submit">
                    登录
                </van-button>
            </div>
            <div class="no-password">
                <router-link to="">忘记密码？</router-link>
                <div class="goto-registry">
                    <span>没有账号?</span>
                    <router-link to="/registry">去注册</router-link>
                </div>
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
            const res = await apiUser.login(userInfo);
            if (res) {
                store.saveUser(res);
                storage.setItem('userInfo', res);
                router.push('/detail');
            }
        };

        const userInfo = reactive({
            userName: '',
            userPwd: '',
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
    .no-password {
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
    }
}
</style>

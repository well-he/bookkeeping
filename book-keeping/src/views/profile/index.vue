<template>
    <div class="personal-page">
        <van-cell-group title="个人信息">
            <van-cell title="头像" center>
                <template #value>
                    <van-image
                        round
                        cover
                        width="3rem"
                        height="3rem"
                        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                    />
                </template>
            </van-cell>
            <van-cell title="ID" v-model:value="profile.user.user_id" />
            <van-cell title="用户名" v-model:value="profile.user.username" />
        </van-cell-group>

        <van-cell-group class="mt3" title="详细信息">
            <van-cell title="邮箱" v-model:value="profile.user.email" />
            <van-cell title="手机号" v-model:value="profile.user.phone" />
        </van-cell-group>

        <div class="operator-group">
            <van-button block class="mt3" @click="modifyPwd">修改密码</van-button>
            <van-button block class="mt1" @click="updateInfo">编辑资料</van-button>
            <van-button block class="mt1" @click="logout">退出登录</van-button>
        </div>
        <van-popup
            v-model:show="modifyShow"
            round
            position="bottom"
            :style="{ height: '70%' }"
            class="modify-pop"
        >
            <van-nav-bar :title="popTitle" />
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <div v-if="isPwdShow">
                        <van-field
                            v-model="profile.user.password"
                            name="密码"
                            label="密码"
                            placeholder="请输入密码"
                            :rules="[{ required: true, message: '请填写密码' }]"
                        />
                    </div>
                    <div v-else>
                        <van-field
                            v-model="profile.user.email"
                            name="邮箱"
                            label="邮箱"
                            placeholder="请输入邮箱"
                            :rules="[{ required: true, message: '请填写邮箱' }]"
                        />
                        <van-field
                            v-model="profile.user.phone"
                            name="手机号"
                            label="手机号"
                            placeholder="请输入手机号"
                            :rules="[{ required: true, message: '请填写手机号' }]"
                        />
                    </div>
                </van-cell-group>
                <div class="btn-group">
                    <van-button type="success" block native-type="submit">提交</van-button>
                    <van-button type="warning" block @click="modifyShow = false">取消</van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { showConfirmDialog, showNotify, showSuccessToast, showToast } from 'vant';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import useStorage from '@/utils/storage';
import apiUser from '@/api/user';
const modifyShow = ref(false);
const isPwdShow = ref(true);
const popTitle = ref('编辑');
const store = useStore();
const storage = useStorage();
const router = useRouter();
let profile = reactive({
    user: {},
});

const modifyPwd = () => {
    popTitle.value = '修改密码';
    isPwdShow.value = true;
    modifyShow.value = true;

    profile.user.password = '';
};
const updateInfo = () => {
    popTitle.value = '编辑资料';
    isPwdShow.value = false;
    modifyShow.value = true;
};

const onSubmit = values => {
    if (isPwdShow.value) {
        //修改密码
        showConfirmDialog({
            title: '提示',
            message: '确认修改吗?',
            width: 320,
        })
            .then(async r => {
                const res = await apiUser.modifyPwd({
                    userName: profile.user.username,
                    userPwd: profile.user.password,
                });
                if (res) {
                    modifyShow.value = false;
                    showSuccessToast({
                        message: '修改成功',
                        className: 'toast',
                        iconSize: 36,
                    });
                }
            })
            .catch();
    } else {
        //编辑资料
        showConfirmDialog({
            title: '提示',
            message: '确认修改吗?',
            width: 320,
        })
            .then(async r => {
                const { username, password, email, phone } = profile.user;
                const res = await apiUser.modify({
                    userName: username,
                    userPwd: password,
                    email,
                    phone,
                });
                if (res) {
                    modifyShow.value = false;
                    showSuccessToast({
                        message: '修改成功',
                        className: 'toast',
                        iconSize: 36,
                    });
                }
            })
            .catch();
    }
};

const logout = () => {
    showConfirmDialog({
        title: '标题',
        message: '确认退出吗？',
        width: 320,
        cancelButtonColor: '#f00',
    })
        .then(() => {
            store.logoutUser();
            storage.clear();
            router.push('/login');
        })
        .catch(() => {});
};

onMounted(() => {
    profile.user = storage.getItem('userInfo');
});
</script>

<style lang="scss" scoped>
.personal-page {
    .van-cell {
        background-color: #fff;
    }

    .operator-group {
        padding: 0 20px;
        .mt3 {
            margin-top: 30px;
        }
        .mt1 {
            margin-top: 10px;
        }
    }
    .modify-pop {
        .btn-group {
            margin-top: 30px;
            display: flex;
            justify-content: space-around;
        }
        .cancel {
            position: absolute;
            bottom: 20px;
        }
    }
}
</style>

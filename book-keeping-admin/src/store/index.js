/**
 * vuex 状态管理
 */
import storage from '../utils/storage';
import { defineStore } from 'pinia';

export const useStore = defineStore('bk-admin', {
    state: () => {
        return {
            userinfo: '' || storage.getItem('userinfo'), //获取用户信息
        };
    },

    actions: {
        saveUserInfo(userinfo) {
            this.userinfo = userinfo;
        },
        clear() {
            this.userinfo = {};
        },
    },
});

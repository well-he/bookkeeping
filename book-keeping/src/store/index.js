import { defineStore } from 'pinia';

export const useStore = defineStore('book-keeping', {
    state: () => ({
        userInfo: {},
        bills: {},
    }),
    actions: {
        saveUser(userinfo) {
            this.userInfo = userinfo;
        },
        logoutUser() {
            this.userInfo = {};
        },
        saveBills(b) {
            this.bills = b;
        },
    },
});

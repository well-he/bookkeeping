<template>
    <el-menu-item v-for="menu in menus" :key="menu.id" :index="menu.to">
        <el-icon><component :is="menu.icon" /></el-icon>
        <span>{{ menu.title }}</span>
    </el-menu-item>
</template>

<script>
import { reactive } from 'vue';

export default {
    name: 'TreeMenu',
    setup() {
        const menus = reactive([
            {
                id: 1,
                title: '用户管理',
                icon: 'User',
                to: 'users',
            },
            {
                id: 2,
                title: '账单管理',
                icon: 'Money',
                to: 'bills',
            },
            {
                id: 3,
                title: '分类管理',
                icon: 'Grid',
                to: 'categories',
            },
        ]);
        return { menus };
    },
};
</script>

<style lang="scss" scoped></style>

<template>
    <div v-for="menu in menus">
        <div v-if="menu.childern">
            <el-sub-menu :index="menu.id">
                <template #title>
                    <el-icon><component :is="menu.icon" /></el-icon>
                    <span>{{ menu.title }}</span>
                </template>
                <el-menu-item v-for="c in menu.childern" :index="c.to" :key="c.id">
                    <el-icon><component :is="c.icon" /></el-icon>
                    <span>{{ c.title }}</span>
                </el-menu-item>
            </el-sub-menu>
        </div>
        <div v-else>
            <el-menu-item :key="menu.id" :index="menu.to">
                <el-icon><component :is="menu.icon" /></el-icon>
                <span>{{ menu.title }}</span>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';

export default {
    name: 'TreeMenu',
    setup() {
        const menus = reactive([
            {
                id: '1',
                title: '用户管理',
                icon: 'User',
                to: 'users',
            },
            {
                id: '2',
                title: '账单管理',
                icon: 'Money',
                to: 'bills',
            },
            {
                id: '3',
                title: '分类管理',
                icon: 'Menu',
                childern: [
                    {
                        id: '3-1',
                        title: '支出',
                        icon: 'Grid',
                        to: 'expense',
                    },
                    {
                        id: '3-2',
                        title: '收入',
                        icon: 'Grid',
                        to: 'income',
                    },
                ],
            },
        ]);
        return { menus };
    },
};
</script>

<style lang="scss" scoped></style>

import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../components/Home.vue';
import storage from '../utils/storage';
const routes = [
    {
        name: 'system',
        path: '/',
        redirect: '/system',
        meta: {
            title: '首页',
        },
        beforeEnter: (to, from, next) => {
            if (storage.getItem('userinfo')) {
                next();
            } else {
                next('/login');
            }
        },
        component: Home,
        children: [
            {
                name: 'welcome',
                path: '/system',
                component: () => import('../views/welcome/index.vue'),
                meta: {
                    title: '欢迎页',
                },
            },
            {
                name: 'users',
                path: '/users',
                component: () => import('../views/users/index.vue'),
                meta: {
                    title: '用户管理',
                },
            },
            {
                name: 'bills',
                path: '/bills',
                component: () => import('../views/bills/index.vue'),
                meta: {
                    title: '账单管理',
                },
            },
            {
                name: 'expense',
                path: '/expense',
                component: () => import('../views/categories/expense.vue'),
                meta: {
                    title: '分类管理 / 支出',
                },
            },
            {
                name: 'income',
                path: '/income',
                component: () => import('../views/categories/income.vue'),
                meta: {
                    title: '分类管理 / 收入',
                },
            },
            {
                path: '/404',
                name: 'NotFound',
                meta: {
                    title: 'Page not found',
                    isLogin: false,
                },
                component: () => import('../views/NotFound.vue'),
            },
        ],
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录',
        },
        component: () => import('../views/login/index.vue'),
    },
    // 所有未定义路由，全部重定向到404页
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;

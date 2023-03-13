import { createRouter, createWebHashHistory } from 'vue-router';
import useStorage from '@/utils/storage';
const { getItem } = useStorage();
const routes = [
    {
        name: 'book-keeping',
        path: '/',
        meta: {
            title: '记账本',
            active: 0,
        },
        beforeEnter: (to, from, next) => {
            if (getItem('userInfo')) {
                next();
            } else {
                next('/login');
            }
        },
        component: () => import('@/views/Layout.vue'),
        redirect: '/detail',
        children: [
            {
                name: 'detail',
                path: '/detail',
                component: () => import('@/views/detail/index.vue'),
                meta: {
                    title: '记账本',
                    active: 0,
                },
            },
            {
                name: 'chart',
                path: '/chart',
                component: () => import('@/views/chart/index.vue'),
                meta: {
                    title: '图表',
                    active: 1,
                },
            },
            {
                name: 'profile',
                path: '/profile',
                component: () => import('@/views/profile/index.vue'),
                meta: {
                    title: '我的',
                    active: 2,
                },
            },
        ],
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录',
        },
        component: () => import('@/views/login/index.vue'),
    },
    {
        name: 'registry',
        path: '/registry',
        meta: {
            title: '注册',
        },
        component: () => import('@/views/registry/index.vue'),
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

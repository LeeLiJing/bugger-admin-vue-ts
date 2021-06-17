import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/views/Layout/index.vue';
import { CoreRouter } from '@/types';

// 忽律规则
const ignore: any = {
    token: [ '/login', '/403', '/404', '/500', '/502' ]
};

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/Home/index.vue')
            }
        ]
    },
    {
        path: '/:catchAll(.*)',
        name: '404',
        redirect: '/404'
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
}) as CoreRouter;

export default router;
export { ignore };

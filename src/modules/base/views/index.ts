export default [
    {
        label: '用户列表',
        path: '/sys/user',
        component: () => import('./user.vue')
    },
    {
        label: '角色列表',
        path: '/sys/role',
        component: () => import('./role.vue')
    }
];

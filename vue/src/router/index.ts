import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/pages/Index.vue')
    },
    {
        path: '/room/:id',
        name: 'Room',
        component: () => import('@/pages/Room.vue'),
        // 只检查本地有无通行证
        beforeEnter: async () => {
            const id = sessionStorage.getItem('id');
            const token = sessionStorage.getItem('token');
            if (!id || !token) {
                // return '/';
            }
        },
    }
]

export default createRouter({
    routes,
    history: createWebHashHistory()
});
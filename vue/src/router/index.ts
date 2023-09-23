import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/pages/Index.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/pages/index/Home.vue')
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('@/pages/index/About.vue')
            }
        ]
    },
    {
        path: '/room',
        redirect: '/'
    },
    {
        path: '/room/:roomId',
        name: 'Room',
        component: () => import('@/pages/Room.vue'),
        // 判断路径完整
        beforeEnter: async to => {
            const roomId = to.params.roomId;
            const invitation = to.query.invitation;
            if (!roomId || !invitation) {
                return '/';
            } else {
                sessionStorage.setItem('roomId', roomId as string);
                sessionStorage.setItem('invitation', invitation as string);
            }

        }
    }
]

export default createRouter({
    routes,
    history: createWebHashHistory()
});
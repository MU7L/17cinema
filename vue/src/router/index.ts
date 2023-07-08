import { createRouter, createWebHashHistory } from "vue-router";
import { Recv, checkRoom } from '../apis';

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
        beforeEnter: async () => {
            const id = sessionStorage.getItem('id');
            const token = sessionStorage.getItem('token');
            if (!id || !token) {
                return '/';
            }
            const recv:Recv<null> = await checkRoom(id, token);
            if(recv.code !== 200) {
                alert(recv.msg);
                return '/';
            }
        },
    }
]

export default createRouter({
    routes,
    history: createWebHashHistory()
});
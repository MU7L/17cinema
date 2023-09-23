<template>
    <div class="h-screen flex flex-col">
        <header class="py-3 px-8 flex justify-between items-center">
            <div class="flex items-center space-x-4">

                <VideoCameraIcon class="h-8"></VideoCameraIcon>
                <h1 class="text-xl font-bold">Room: {{ room.title }}</h1>

                <div class="text-xs">
                    <button v-if="isSupported" @click="copy('一起看电影 -> ' + room.a)"
                        class="p-1 rounded ring-1 ring-stone-500 hover:bg-stone-600 active:bg-stone-800 transition-colors">
                        {{ copied ? '已复制' : '分享链接' }}
                    </button>
                    <p v-else>分享链接：{{ room.a }}</p>
                </div>

            </div>

            <div class="flex items-center space-x-4">

                <p>房内人数: {{ room.members }}</p>

                <!-- 初始化 同步中 -->
                <div v-if="state.value === State.INIT || state.value === State.LOADING"
                    class="text-red-500 flex items-center space-x-1">
                    <ArrowPathIcon class="animate-spin h-5 w-5"></ArrowPathIcon>
                    <span>{{ state.value }}</span>
                </div>
                <!-- 已同步 播放中 -->
                <div v-else class="text-blue-300 flex items-center space-x-1">
                    <CheckCircleIcon class="h-5 w-5"></CheckCircleIcon>
                    <span>{{ state.value }}</span>
                </div>

            </div>
        </header>

        <!-- 视频 -->
        <main class="flex-1 max-h-full flex">
            <div class="flex-1">
                <SyncVideo :src="room.src"></SyncVideo>
            </div>
            <div class="w-96">
                <Chat></Chat>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { VideoCameraIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import SyncVideo from '@/components/SyncVideo.vue';
import Chat from '@/components/Chat.vue';
import { onBeforeMount, reactive } from 'vue';
import { useClipboard } from '@vueuse/core'
import machine, { State } from '@/store/machine';
import { useMachine } from '@xstate/vue';
import { useRoute } from 'vue-router';
import { getRoom } from '@/apis';
import useSocket from '@/utils/socketIO';

const route = useRoute();

// 房间信息
const room = reactive({
    roomId: route.params.roomId as string,
    invitation: route.query.invitation as string,
    a: window.location.href,
    title: route.params.roomId as string,
    members: 1,
    src: '',
});

onBeforeMount(async () => {
    const data = await getRoom(room.roomId, room.invitation);
    if (!data) return;
    room.title = data.title;
    room.src = data.src;
});

// btn点击复制
const { copy, copied, isSupported } = useClipboard();

// 状态机
const { state } = useMachine(machine);

// socket
const socket = useSocket(room.roomId, room.invitation);

// 新用户
socket.on('new', num => room.members = num);

</script>@/utils/machine
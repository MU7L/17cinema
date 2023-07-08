<template>
    <header class="bg-stone-700 py-3 px-5 flex justify-between items-center">
        <div class="space-x-3">
            <!-- 房间名 -->
            <span class="text-xl font-bold">Room: {{ room.title }}</span>
            <!-- 邀请码 -->
            <span class="text-xs">邀请码：<a class="hover:text-gray-500 cursor-pointer">{{ room.invitation }}</a></span>
        </div>
        <div>
            <div v-if="state === State.INIT || state === State.LOADING" class="text-red-500 flex items-center space-x-1">
                <ArrowPathIcon class="animate-spin h-5 w-5"></ArrowPathIcon>
                <span>{{ store.strState }}</span>
            </div>
            <div v-else class="text-blue-300 flex items-center space-x-1">
                <CheckCircleIcon class="h-5 w-5"></CheckCircleIcon>
                <span>{{ store.strState }}</span>
            </div>
        </div>
    </header>
    <main class="p-10 flex justify-center items-center">
        <SyncVideo :src="video.src" :currentTime="video.currentTime" @ready="onReady" @play="onPlay" @pause="onPause">
        </SyncVideo>
    </main>
</template>

<script setup lang="ts">
import SyncVideo from '@/components/SyncVideo.vue';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import useWebSocketHub from '@/utils/useWebsocketHub';
import { getRoom } from '@/apis';
import useStateStore, { State } from '@/store';

// 当前路由
const route = useRoute();

// 房间信息
const room = reactive<{
    id: string;
    title: string;
    invitation: string;
}>({
    id: route.params.id as string,
    title: '',
    invitation: '',
});
onMounted(async () => {
    const res = await getRoom(room.id);
    if (res.code === 200 && res.data) {
        room.title = res.data.title;
        room.invitation = res.data.invitation;
    } else {
        alert('房间信息获取失败');
    }
});

// 视频信息
const video = reactive<{
    src: string;
    currentTime: number;
}>({
    src: '',
    currentTime: 0
})

const myID = sessionStorage.getItem('id') as string;

// 状态管理
const store = useStateStore();
const state = computed<State>(() => store.currentState);

// websocket hub
type Topic = 'init' | 'play' | 'pause' | 'ready';
interface Msg {
    user?: string,
    timestamp: number,
    currentTime?: number,
    currentSrc?: string
}
const hub = useWebSocketHub<Topic, Msg>(room.id);

// 接收 init
hub.on('init', (msg: Msg) => {
    video.src = msg.currentSrc as string;
    video.currentTime = msg.currentTime as number;
    store.change('init');
});

// 发送 ready
const onReady = () => {
    switch (state.value) {
        case State.LOADING:
            hub.emit('ready', {
                user: myID,
                timestamp: (new Date()).getTime()
            });
            break;
        case State.INIT:
            hub.emit('init', {
                user: myID,
                timestamp: (new Date()).getTime()
            });
            break;
    }
}

// 接收 play
hub.on('play', () => {
    store.change('play');
});

// 接收 pause
hub.on('pause', (msg: Msg) => {
    if (state.value === State.PLAYING) {
        if (msg.currentSrc) {
            video.src = msg.currentSrc;
        }
        if (msg.currentTime) {
            video.currentTime = msg.currentTime;
        }
        store.change('pause');
    }
});

// 接收 ready 此时真正同步
hub.on('ready', () => {
    store.change('ready');
});

// ready状态下页面解锁后才能发送 play
const onPlay = () => {
    if (state.value === State.READY) {
        hub.emit('play', {
            user: myID,
            timestamp: (new Date()).getTime()
        });
    }
}

// playing状态下发送 pause 时同步
const onPause = (currentTime: number) => {
    if (state.value === State.PLAYING) {
        hub.emit('pause', {
            user: myID,
            timestamp: (new Date()).getTime(),
            currentTime
        });
        video.currentTime = currentTime;
        store.currentState = State.LOADING;
    }
}

</script>
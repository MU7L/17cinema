<template>
    <div class="flex flex-col space-y-1">
        <!-- 修改视频源 -->
        <SyncVideoSrc :currentSrc="currentSrc"></SyncVideoSrc>

        <!-- 视频 -->
        <div class="relative rounded-lg overflow-hidden shadow-lg">
            <!-- 视频源 -->
            <video ref="videoRef" controls :src="currentSrc" @play="onPlay" @pause="onPause" @canplay="onCanPlay"></video>
            <!-- 遮罩 -->
            <div v-show="state !== State.PLAYING" @click="onModalClick"
                class="z-10 absolute inset-0 bg-white/20 flex justify-center items-center">
                <PlayCircleIcon v-if="state === State.READY" class="w-20 h-20 cursor-pointer"></PlayCircleIcon>
                <ArrowPathIcon v-else class="animate-spin w-20 h-20"></ArrowPathIcon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowPathIcon, PlayCircleIcon } from '@heroicons/vue/24/outline';
import useStateStore, { State } from '@/store';
import useSocket, { ClientToServerEvents, ServerToClientEvents } from '@/utils/useSocket';
import { Socket } from 'socket.io-client';
import SyncVideoSrc from './SyncVideoSrc.vue';

// ws实例
const socket = useSocket() as Socket<ServerToClientEvents, ClientToServerEvents>;

// 视频组件
const currentSrc = ref<string>('');
const videoRef = ref<HTMLVideoElement | null>(null);

// 状态机
const stateStore = useStateStore();
const state = computed(() => stateStore.currentState);

// 初始化
socket.on('init', (src, currentTime) => {
    console.log('recv init', {src, currentTime});
    if (videoRef.value) {
        stateStore.on('init');
        currentSrc.value = src;
        videoRef.value.currentTime = currentTime;
    }
});

// 加载完成
const onCanPlay = () => {
    if (videoRef.value) {
        switch (state.value) {
            case State.INIT:
                socket.emit('init ready');
                console.log('send init ready');
                break;
            case State.LOADING:
                socket.emit('ready');
                console.log('ready');
                break;
        }
    }
}

socket.on('pause', (currentTime: number) => {
    console.log('recv pause', {currentSrc});
    stateStore.on('pause');
    if (videoRef.value) {
        videoRef.value.currentTime = currentTime;
    }
});

socket.on('play', () => {
    console.log('recv play');
    stateStore.on('play');
});
socket.on('ready', () => {
    console.log('recv ready');
    stateStore.on('ready');
});

// 状态驱动
watch(state, (newState: State) => {
    if (videoRef.value) {
        switch (newState) {
            case State.LOADING:
                videoRef.value.pause();
                break;
            case State.PLAYING:
                videoRef.value.play();
                break;
            case State.READY:
                videoRef.value.pause();
                break;
        }
    }
});

const onModalClick = () => {
    if (state.value === State.READY) {
        socket.emit('play');
        console.log('send play');
    }
}

// 限制只有ready/playing状态才能播放
const onPlay = () => {
    if (state.value === State.READY || state.value === State.PLAYING) return;
    else {
        videoRef.value?.pause();
    }
}

// 发送暂停
const onPause = (e: Event) => {
    if (state.value === State.PLAYING) {
        socket.emit('pause', (e.target as HTMLVideoElement).currentTime);
        console.log('send pause');
    }
}

</script>
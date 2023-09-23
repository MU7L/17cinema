<template>
    <div class="relative h-full">
        <!-- 视频源 -->
        <video ref="videoRef" :src="props.src" controls @canplay="send('ready')" @pause="onpause"
            class="relative bg-black object-contain h-full w-full"></video>

        <!-- 遮罩 SYNCED和SYNCING时显示 -->
        <div v-show="!state.matches(State.PLAYING)" @click="onplay"
            class="z-10 absolute inset-0 bg-white/20 flex justify-center items-center">
            <!-- SYNCED -->
            <PlayCircleIcon v-if="state.matches(State.SYNCED)" class="w-20 h-20 cursor-pointer"></PlayCircleIcon>
            <!-- SYNCING -->
            <ArrowPathIcon v-else-if="state.matches(State.SYNCING)" class="animate-spin w-20 h-20"></ArrowPathIcon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, PlayCircleIcon } from '@heroicons/vue/24/outline';
import { useMediaControls } from '@vueuse/core';
import { ref } from 'vue';
import machine, { State } from '@/store/machine';
import { useMachine } from '@xstate/vue';
import useSocket from '@/utils/socketIO';

const props = defineProps<{
    src: string;
}>();

// TODO: server <-> socket <-> machine <-> video 测试

// 视频控件
const videoRef = ref<HTMLVideoElement>();
const { currentTime, waiting, playing } = useMediaControls(videoRef);
const onplay = () => { socket.emit('play') }
const onpause = () => {
    send('pause');
    socket.emit('pause', currentTime.value)
}

// socket
const roomId = sessionStorage.getItem('roomId') as string;
const invitation = sessionStorage.getItem('invitation') as string;
const socket = useSocket(roomId, invitation);

// 状态机
const { state, send, service } = useMachine(machine, {
    actions: {
        updateCurrentTime: (_, event) => {
            if (event.currentTime) currentTime.value = event.currentTime;
        },
        sendReady: () => socket.emit('ready'),
        play: () => playing.value = true,
        pause: () => playing.value = false
    }
});

// socket
socket.on('connect', () => {
    socket.on('init', time => send('init', { currentTime: time }));
    socket.on('pause', time => send('pause', { currentTime: time }));
    socket.on('ready', () => send('ready'));
    socket.on('play', () => send('play'));
});


</script>@/utils/machine
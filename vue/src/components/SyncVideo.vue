<template>
    <div class="relative rounded-lg overflow-hidden shadow-lg">
        <!-- 视频源 -->
        <video ref="videoRef" controls :src="props.src" @play="onPlay" @pause="onPause" @canplay="onCanPlay"></video>
        <!-- 遮罩 -->
        <div v-show="state !== State.PLAYING" @click="onModalClick"
            class="z-10 absolute inset-0 bg-white/20 flex justify-center items-center">
            <PlayCircleIcon v-if="state === State.READY" class="w-20 h-20 cursor-pointer"></PlayCircleIcon>
            <ArrowPathIcon v-else class="animate-spin w-20 h-20"></ArrowPathIcon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowPathIcon, PlayCircleIcon } from '@heroicons/vue/24/outline';
import useStateStore, { State } from '@/store';

const props = defineProps<{
    src: string;
    currentTime: number;
}>();

// 状态机
const store = useStateStore();
const state = computed(() => store.currentState);

// 视频组件
const videoRef = ref<HTMLVideoElement | null>(null);

// 接收到play时播放
watch(state, (newState: State) => {
    if (videoRef.value) {
        switch (newState) {
            case State.INIT:
                videoRef.value.currentTime = props.currentTime;
                videoRef.value.pause();
                break;
            case State.LOADING:
                videoRef.value.currentTime = props.currentTime;
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
}
);

const emit = defineEmits<{
    (e: 'play'): void;
    (e: 'pause', currentTime: number): void;
    (e: 'ready'): void;
}>();

const onModalClick = () => {
    if (state.value === State.READY) {
        emit('play');
    }
}

// 限制只有ready状态才能播放
const onPlay = () => {
    // if (state.value === State.READY) return;
    // else {
    //     console.log(111);

    //     videoRef.value?.pause();
    // }
}

// 发送
const onPause = (e: Event) => {
    if (state.value === State.PLAYING) {
        emit('pause', (e.target as HTMLVideoElement).currentTime);
    }
}

const onCanPlay = () => {
    if (state.value === State.INIT || state.value === State.LOADING) {
        videoRef.value?.pause();
        emit('ready');
    }
}

</script>
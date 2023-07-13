<template>
    <!-- 输入框 -->
    <form class="group px-1 text-stone-600 flex justify-between items-center space-x-1">
        <label for="inputURL" class="transition-colors group-hover:text-white">视频源:</label>
        <input id="inputURL" type="text" v-model="input"
            class="flex-1 bg-transparent focus:outline-none transition-colors focus:text-white group-hover:text-white">
        <!-- 当视频源改变且输入合法时显示 -->
        <button v-show="inputChanged && inputValid" @click="onSubmit" class="text-stone-400 hover:text-blue-300">
            <ArrowUpCircleIcon class="w-5 h-5"></ArrowUpCircleIcon>
        </button>
    </form>
</template>

<script setup lang="ts">
import { Socket } from 'socket.io-client';
import { ref, computed, onMounted } from 'vue';
import { ArrowUpCircleIcon } from '@heroicons/vue/20/solid';
import useSocket, { ServerToClientEvents, ClientToServerEvents } from '@/utils/useSocket';

const props = defineProps<{
    currentSrc: string;
}>();
onMounted(()=>{
    input.value = props.currentSrc;
})

// ws实例
const socket = useSocket() as Socket<ServerToClientEvents, ClientToServerEvents>;

// 原始输入
const input = ref<string>(props.currentSrc);
socket.on('src', (src: string) => {
    input.value = src;
})

// 去空格
const pureInput = computed<string>(() => {
    return input.value.replace(/[ ]|[\r\n]/g, '');
});

// 输入改变
const inputChanged = computed(() => {
    return pureInput.value === props.currentSrc;
});

// TODO: 判断输入合法性，后期加入网址类型识别
const inputValid = computed<boolean>(() => {
    // https://s138.ananas.chaoxing.com/sv-w8/video/1e/46/00/6553b35d4110edf1137136a580289c24/sd.mp4
    return /^https:\/\/.*\.mp4$/.test(pureInput.value);
});

// 提交修改
const onSubmit = (e: Event) => {
    e.preventDefault();
    if (inputChanged.value && inputValid.value) {
        socket.emit('src', pureInput.value);
    }
}
</script>
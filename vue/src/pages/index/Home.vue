<template>
    <video class="fixed -z-20 h-screen w-screen object-cover" :src="BgVideo" autoplay muted loop></video>

    <main class="h-screen flex flex-col justify-center items-center space-y-10">
        <!-- <div class="text-center space-y-6"> -->
        <p class="text-7xl font-extrabold"><span id="slogan"></span></p>
        <p class="text-gray-300">一起在线看视频，无论相隔多远。</p>
        <!-- </div> -->
        <CreateForm></CreateForm>

    </main>

    <footer class="fixed bottom-0 inset-x-0 text-center mb-8 text-gray-600">
        <div v-if="roomsData && roomsData.data.rooms !== 0" class="text-gray-400">当前共有 {{ roomsData.data.rooms }} 个房间</div>
        <div v-else>当前没有房间</div>
    </footer>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import Typed from 'typed.js';
import BgVideo from '/pexels.mp4';
import CreateForm from '@/components/CreateForm.vue';
import { useFetch } from '@vueuse/core';
import { SERVER } from '@/configs';

// 标题
let typed: any = null;
onMounted(() => {
    typed = new Typed('#slogan', {
        strings: ['海内存知己，天涯若比邻。'],
        typeSpeed: 100,
        cursorChar: '_'
    });
});
onBeforeUnmount(() => {
    typed.destroy();
});

// 当前房间数
const { data: roomsData } = useFetch<{
    code: number;
    data: {
        rooms: number;
    }
}>(SERVER + '/rooms').get().json();

</script>

<style scoped>
button {
    @apply py-2 px-3
}

button.btn-active {
    @apply rounded bg-gray-300/60
}
</style>
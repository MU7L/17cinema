<template>
    <header class="bg-stone-700 py-3 px-5 flex justify-between items-center">
        <!-- 左侧 -->
        <div class="flex items-baseline space-x-3">
            <!-- 房间名 -->
            <h1 class="text-xl font-bold">Room: {{ room.title }}</h1>
            <!-- 邀请码 -->
            <div class="text-xs">
                <button v-if="canCopy" id="copy-btn" @click="copyText" :data-clipboard-text="room.invitation"
                    class="p-1 rounded ring-1 ring-stone-500 hover:bg-stone-600 active:bg-stone-800 transition-colors">{{
                        btnInfo }}</button>
                <p v-else>浏览器不支持自动复制，请手动复制：{{ room.invitation }}</p>
            </div>
        </div>

        <!-- 右侧 -->
        <div>
            <div v-if="state === State.INIT || state === State.LOADING" class="text-red-500 flex items-center space-x-1">
                <ArrowPathIcon class="animate-spin h-5 w-5"></ArrowPathIcon>
                <span>{{ state }}</span>
            </div>
            <div v-else class="text-blue-300 flex items-center space-x-1">
                <CheckCircleIcon class="h-5 w-5"></CheckCircleIcon>
                <span>{{ state }}</span>
            </div>
        </div>
    </header>

    <main class="p-10 flex justify-center items-center space-x-10">
        <div>
            <SyncVideo></SyncVideo>
        </div>
        <!-- <div class="w-1/3">
            <Chat></Chat>
        </div> -->


    </main>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Clipboard from 'clipboard';
import SyncVideo from '@/components/SyncVideo.vue';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { GetData, getRoom } from '@/apis';
import useStateStore, { State } from '@/store';

// 路由
const route = useRoute();
const router = useRouter();

// 房间信息
const room = reactive<{
    id: string;
    title: string;
    invitation: string;
}>({
    id: route.params.id as string,
    title: '114514',
    invitation: '114514',
});
onBeforeMount(async () => {
    const res = await getRoom(room.id) as GetData | null;
    if (!res) {
        // router.back();
        return;
    }
    room.title = res.title;
    room.invitation = res.invitation;
});

// btn点击复制
const btnInfos = {
    before: '点击复制口令',
    after: '已复制',
};
const btnInfo = ref<string>(btnInfos.before);
const canCopy = ref<boolean>(true);
const copyText = () => {
    const clipboard = new Clipboard('#copy-btn');
    clipboard.on('success', () => {
        btnInfo.value = btnInfos.after;
        setTimeout(() => {
            btnInfo.value = btnInfos.before;
        }, 5000);
        clipboard.destroy();
    });
    clipboard.on('error', () => {
        canCopy.value = false;
        clipboard.destroy();
    });
}

// 状态管理
const store = useStateStore();
const state = computed<State>(() => store.currentState);

</script>
<template>
    <div class="h-full p-5 flex flex-col">
        <ul class="flex-1">
            <li v-for="msg of msgList" :key="msg.time">
                <p>
                    <span>[{{ msg.time }}] </span>
                    <span>{{ msg.nickname }} :</span>
                </p>
                <p>{{ msg.content }}</p>
            </li>
        </ul>

        <div class="relative h-52 rounded-xl bg-stone-800 shadow">
            <textarea class="w-full h-full bg-transparent resize-none"></textarea>
            <button class="absolute bottom-5 right-5">发送</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const msgList = ref([
    {
        time: (new Date()).toLocaleTimeString(),
        nickname: '丁真',
        content: '111'
    }
]);
</script>
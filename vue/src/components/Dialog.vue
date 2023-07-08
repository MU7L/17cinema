<template>
    <!-- 遮罩 -->
    <div class="fixed inset-0 bg-black/20 flex justify-center items-center">
        <!-- 外框 -->
        <div class="bg-stone-700 p-4 rounded-lg space-y-3 w-96 shadow-2xl shadow-black">
            <!-- 顶栏 -->
            <div class="flex justify-between items-center">
                <button @click="emit('clickLeft')" class="btn">
                    <ChevronLeftIcon class="w-5"></ChevronLeftIcon>
                    <p>{{ props.left }}</p>
                </button>
                <h2>{{ props.title }}</h2>
                <button @click="emit('clickRight')" class="btn">
                    <p>{{ props.right }}</p>
                    <ChevronRightIcon class="w-5"></ChevronRightIcon>
                </button>
            </div>
            <hr>
            <!-- 内容 -->
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(defineProps<{
    left?: string;
    title?: string;
    right?: string;
}>(), {
    left: '取消',
    title: '',
    right: '完成'
});

const emit = defineEmits<{
    (e: 'clickLeft'): void;
    (e: 'clickRight'): void;
}>();
</script>

<style scoped>
.btn {
    @apply flex items-center space-x-1 hover:text-blue-300 active:text-blue-400 transition-colors
}
</style>
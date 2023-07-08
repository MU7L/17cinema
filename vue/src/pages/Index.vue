<template>
    <div class="fixed inset-0 flex flex-col justify-center items-center space-y-28">
        <h1 class="font-extrabold text-9xl">欢迎</h1>
        <div class="space-x-20">
            <button @click="showJoinDialog = true"
                class="btn bg-green-500 ring-green-300 hover:bg-green-400 active:bg-green-600">加入房间</button>
            <button @click="showCreateDialog = true"
                class="btn bg-blue-500 ring-blue-300 hover:bg-blue-400 active:bg-blue-600">创建房间</button>
        </div>
    </div>
    <Teleport to="body">
        <Transition>
            <JoinDialog v-show="showJoinDialog" @close="showJoinDialog = false"></JoinDialog>
        </Transition>
        <Transition>
            <CreateDialog v-show="showCreateDialog" @close="showCreateDialog = false"></CreateDialog>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateDialog from '@/components/CreateDialog.vue';
import JoinDialog from '@/components/JoinDialog.vue';

const showCreateDialog = ref<boolean>(false);
const showJoinDialog = ref<boolean>(false);

</script>

<style scoped>
.btn {
    @apply p-2 rounded ring-2 transition-colors
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
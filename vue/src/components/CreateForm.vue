<template>
    <form>
        <div class="btn-hover">
            <label for="title">房间名: </label>
            <input id="title" type="text" v-model.trim="form.title">
        </div>
        <div class="btn-hover">
            <label for="src">视频源: </label>
            <input id="src" type="text" v-model.trim="form.src" required>
        </div>
    </form>

    <button :class="canSubmit ? 'text-gray-300' : ['text-gray-700', 'cursor-not-allowed']" :disabled="!canSubmit"
        @click="onSubmit">
        创建房间
    </button>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createRoom } from '@/apis';

export interface IForm {
    title: string;
    src: string;
}
const form = reactive<IForm>({
    title: '',
    src: ''
});

const canSubmit = computed(() => !Object.values(form).includes(''));

const router = useRouter();

const onSubmit = async () => {
    const res = await createRoom(form);
    if (!res) return;
    router.push(`/room/${res.roomId}?invitation=${res.invitation}`);
}

</script>

<style scoped>
form>div {
    @apply p-2 rounded space-x-3
}

label {
    @apply inline-block w-20 text-left
}

input {
    @apply bg-transparent border-b-2 outline-none
}

button {
    @apply btn-hover px-3 py-2
}
</style>
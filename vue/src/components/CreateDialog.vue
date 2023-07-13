<template>
    <Dialog title="创建房间" @click-left="onCancel" @click-right="onSubmit">
        <form class="space-y-2" @submit="onSubmit">
            <div>
                <label for="nickname">昵称：</label>
                <input id="nickname" type="text" v-model="formData.nickname" placeholder="请输入昵称">
            </div>
            <div>
                <label for="title">房间名：</label>
                <input id="title" type="text" v-model="formData.title" placeholder="请输入房间名">
            </div>
        </form>
    </Dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Dialog from './Dialog.vue';
import { PostData, createRoom } from '@/apis';
import { useRouter } from 'vue-router';

const router = useRouter();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

interface CreateForm {
    nickname: string;
    title: string;
}

const formData = reactive<CreateForm>({
    nickname: '',
    title: '',
});

const onCancel = () => {
    formData.nickname = '';
    formData.title = '';
    emit('close');
}

// 检查
const table: { [key: string]: string } = {
    nickname: '昵称',
    title: '房间名'
}
const check = (): CreateForm | null => {
    const _formData: CreateForm = {
        nickname: formData.nickname.trim(),
        title: formData.title.trim()
    }
    const errItems: string[] = [];
    Object.entries(_formData).forEach(([k, v]) => {
        if (v === '') {
            errItems.push(table[k]);
        }
    });
    if (errItems.length !== 0) {
        alert(`${errItems.join('、')}不能为空`);
        return null
    } else {
        return _formData;
    }
}

const onSubmit = async () => {
    let _formData = check();
    if (_formData) {
        const res = await createRoom(_formData.title) as PostData | null;
        if (!res) return;
        sessionStorage.setItem('nickname', _formData.nickname);
        sessionStorage.setItem('roomId', res.roomId as string);
        sessionStorage.setItem('token', res.token as string);
        router.push('/room/' + res.roomId);
    }
}

</script>

<style scoped>
input {
    @apply w-full p-1 bg-stone-700 border-b-2 rounded focus:outline-none focus:bg-stone-600
}
</style>
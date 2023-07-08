<template>
    <Dialog title="创建房间" @click-left="onCancel" @click-right="onSubmit">
        <form class="space-y-2">
            <div class="form-item">
                <p>昵称：</p>
                <input type="text" v-model="formData.nickname" placeholder="请输入昵称">
            </div>
            <div class="form-item">
                <p>房间名：</p>
                <input type="text" v-model="formData.title" placeholder="请输入房间名">
            </div>
        </form>
    </Dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Dialog from './Dialog.vue';
import { createRoom } from '@/apis';
import { useRouter } from 'vue-router';

const router = useRouter();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

export interface CreateSend {
    nickname: string;
    title: string;
}

const formData = reactive<CreateSend>({
    nickname: '',
    title: '',
});

const onCancel = () => {
    formData.nickname = '';
    formData.title = '';
    emit('close');
}

// 检查
const check = (): CreateSend | null => {
    const _formData: CreateSend = {
        nickname: formData.nickname.trim(),
        title: formData.title.trim()
    }
    const errItems: string[] = [];
    Object.entries(_formData).forEach(([k, v]) => {
        if (v === '') {
            errItems.push(k);
        }
    });
    if (errItems.length !== 0) {
        alert(`${errItems.join('、')}不能为空`); // TODO: 改成用户容易理解的名称
        return null
    } else {
        return _formData;
    }
}

export interface CreateRecv {
    msg?: string;
    userId: string,
    roomId: string,
    token: string
}
const onSubmit = async () => {
    let _formData = check();
    if (_formData) {
        const res: CreateRecv | string = await createRoom(_formData);
        if (typeof res === 'string') {
            alert(res);
        } else {
            sessionStorage.setItem('id', res.userId as string);
            sessionStorage.setItem('token', res.token as string);
            router.push('/room/' + res.roomId);
        }
    }
}

</script>

<style scoped>
.form-item>* {
    @apply inline-block
}
p {
    @apply w-20
}
input {
    @apply max-w-full w-auto bg-stone-700 border-b-2 focus:outline-none
}
</style>
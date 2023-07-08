<template>
    <Dialog title="加入房间" @click-left="onCancel" @click-right="onSubmit">
        <form class="space-y-2">
            <div class="form-item">
                <p>昵称：</p>
                <input type="text" v-model="formData.nickname" placeholder="请输入昵称">
            </div>
            <div class="form-item">
                <p>房间号：</p>
                <input type="text" v-model="formData.roomId" placeholder="请输入房间名">
            </div>
            <div class="form-item">
                <p>邀请码：</p>
                <input type="text" v-model="formData.invitation" placeholder="请输入邀请码">
            </div>
        </form>
    </Dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Dialog from './Dialog.vue';
import { joinRoom } from '@/apis';
import { useRouter } from 'vue-router';

const router = useRouter();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

export interface JoinSend {
    nickname: string;
    roomId: string;
    invitation: string;
}

const formData = reactive<JoinSend>({
    nickname: '',
    roomId: '',
    invitation: ''
});

const onCancel = () => {
    formData.nickname = '';
    formData.roomId = '';
    formData.invitation = '';
    emit('close');
}

// 检查
const check = (): JoinSend | null => {
    const _formData: JoinSend = {
        nickname: formData.nickname.trim(),
        roomId: formData.roomId.trim(),
        invitation: formData.invitation.trim()
    }
    const errItems: string[] = [];
    Object.entries(_formData).forEach(([k, v]) => {
        if (v === '') {
            errItems.push(k);
        }
    });
    if (errItems.length !== 0) {
        alert(`${errItems.join('、')}不能为空`);
        return null
    } else {
        return _formData;
    }
}

export interface JoinRecv {
    msg?: string;
    userId?: string;
    roomId?: string;
    token?: string;
}
const onSubmit = async () => {
    let _formData = check();
    if (_formData) {
        const res: JoinRecv | string = await joinRoom(_formData);
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
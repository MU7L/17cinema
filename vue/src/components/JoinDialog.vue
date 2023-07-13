<template>
    <Dialog title="加入房间" @click-left="onCancel" @click-right="onSubmit">
        <form class="space-y-2" @submit="onSubmit">
            <div>
                <label for="nickname">昵称：</label>
                <input id="nickname" type="text" v-model="formData.nickname" placeholder="请输入昵称">
            </div>
            <div>
                <label for="invitation">邀请码：</label>
                <textarea id="invitation" v-model="formData.invitation" placeholder="请输入邀请口令"></textarea>
            </div>
        </form>
    </Dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Dialog from './Dialog.vue';
import { PostData, joinRoom } from '@/apis';
import { useRouter } from 'vue-router';

const router = useRouter();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

interface JoinForm {
    nickname: string;
    invitation: string;
}

const formData = reactive<JoinForm>({
    nickname: '',
    invitation: ''
});

const onCancel = () => {
    formData.nickname = '';
    formData.invitation = '';
    emit('close');
}

// 检查
const table: { [key: string]: string } = {
    nickname: '昵称',
    invitation: '邀请口令'
}
const check = (): JoinForm | null => {
    const _formData: JoinForm = {
        nickname: formData.nickname.trim(),
        invitation: formData.invitation.replace(/[ ]|[\r\n]/g, "")
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
        const res = await joinRoom(_formData.invitation) as PostData | null;
        if (!res) return;
        sessionStorage.setItem('nickname', _formData.nickname);
        sessionStorage.setItem('roomId', res.roomId as string);
        sessionStorage.setItem('token', res.token as string);
        router.push('/room/' + res.roomId);
    }
}

</script>

<style scoped>
input,
textarea {
    @apply w-full p-1 bg-stone-700 border-b-2 rounded focus:outline-none focus:bg-stone-600
}
</style>
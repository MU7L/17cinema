import { API_ADDR } from "@/configs";
import { JoinSend, JoinRecv } from "@/components/JoinDialog.vue";
import { CreateSend, CreateRecv } from '@/components/CreateDialog.vue';

export interface Recv<Data> {
    code: number;
    msg?: string;
    data?: Data
}

export const createRoom = async ({
    nickname,
    title
}: CreateSend): Promise<CreateRecv | string> => {
    console.log(JSON.stringify({ nickname, title }));
    const data = await fetch(API_ADDR + '/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, title })
    }).then(res => res.json()) as Recv<CreateRecv>;
    if (data.code !== 200) {
        return data.msg as string;
    } else {
        return data.data as CreateRecv;
    }
}

export const joinRoom = async ({
    nickname,
    roomId,
    invitation
}: JoinSend): Promise<string | JoinRecv> => {
    const data = await fetch(API_ADDR + '/join', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, roomId, invitation })
    }).then(res => res.json()) as Recv<JoinRecv>;
    if (data.code !== 200) {
        return data.msg as string;
    } else {
        return data.data as JoinRecv;
    }
}

export const checkRoom = async (id: string, token: string): Promise<Recv<null>> => {
    return await fetch(API_ADDR + '/check', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
    }).then(res => res.json());
}

export const getRoom = async (id: string): Promise<Recv<{ title: string, invitation: string }>> => {
    return await fetch(API_ADDR + '/room/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());
}
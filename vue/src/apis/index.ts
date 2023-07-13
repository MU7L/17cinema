import { API_ADDR } from "@/configs";

export interface Recv<Data> {
    code: number;
    data?: Data;
    message?: string;
}

export interface PostData {
    roomId: string;
    token: string;
}

export interface GetData {
    invitation: string;
    title: string;
}

// 创建房间
export const createRoom = async (title: string): Promise<PostData | null> => {
    console.log('send', {title});
    const res = await fetch(API_ADDR + '/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title})
    }).then(res => res.json()) as Recv<PostData>;
    if (res.code !== 200) {
        alert(res.message as string);
        return null;
    } else {
        return res.data as PostData;
    }
}

// 加入房间
export const joinRoom = async (invitation: string): Promise<PostData | null> => {
    console.log('send', {invitation});
    const res = await fetch(API_ADDR + '/join', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({invitation})
    }).then(res => res.json()) as Recv<PostData>;
    if (res.code !== 200) {
        alert(res.message as string);
        return null;
    } else {
        return res.data as PostData;
    }
}

// 获取房间信息
export const getRoom = async (id: string): Promise<GetData | null> => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    const res = await fetch(API_ADDR + '/room/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }).then(res => res.json()) as Recv<GetData>;
    if (res.code !== 200) {
        alert(res.message as string);
        return null;
    } else {
        return res.data as GetData;
    }
}
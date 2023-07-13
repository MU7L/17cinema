import { WS_ADDR } from "@/configs";
import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
    'init': (src: string, currentTime: number) => void;
    'ready': () => void;
    'play': () => void;
    'pause': (currentTime: number) => void;
    'src': (src:string) => void;
    'msg': (nickname: string, content: string) => void;
}

export interface ClientToServerEvents {
    'init ready': () => void;
    'ready': () => void;
    'play': () => void;
    'pause': (currentTime: number) => void;
    'src': (src: string) => void;
    'msg': (content: string) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const init = () => {
    const nickname = sessionStorage.getItem('nickname');
    const token = sessionStorage.getItem('token');
    if (nickname && token) {
        socket = io(WS_ADDR, {
            path: '/ws/',
            auth: { token },
            query: { nickname }
        });
    }
}

const useSocket = () => {
    if (!socket) {
        init();
    }
    return socket;
}

export default useSocket;
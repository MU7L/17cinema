import { SOCKET } from "@/configs";
import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
    // room
    'new': (num: number) => void;
    // video
    'init': (currentTime: number) => void;
    'ready': () => void;
    'play': () => void;
    'pause': (currentTime: number) => void;
    // chat
    'msg': (nickname: string, content: string) => void;
}

export interface ClientToServerEvents {
    'ready': () => void;
    'play': () => void;
    'pause': (currentTime: number) => void;
    'src': (src: string) => void;
    // chat
    'msg': (content: string) => void;
}

type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: SocketClient;

const useSocket = (roomId?: string, invitation?: string) => {
    if (!socket && roomId && invitation) {
        socket = io(SOCKET, {
            auth: { invitation },
            query: { roomId }
        });
        socket.on('connect', () => {
            sessionStorage.setItem('userId', socket.id);
            console.log('userId', socket.id);
        });
    }
    return socket;
}

export default useSocket;
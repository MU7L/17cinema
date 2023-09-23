import http from 'http';
import socketio from 'socket.io';
import logger from './logger';
import initSocket from '../router/ws';
import { CLIENT } from '../configs';

export interface ClientToServerEvents {
    'ready': () => void;
    'play': () => void;
    'pause': (currentTime: number) => void;
    'src': (src: string) => void;
    // chat
    'msg': (content: string) => void;
}

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

export type SocketServer = socketio.Server<ClientToServerEvents, ServerToClientEvents>;

const useSocket = (server: http.Server) => {
    const io = new socketio.Server<ClientToServerEvents, ServerToClientEvents>(server, {
        cors: {
            origin: CLIENT
        }
    });
    initSocket(io);
    logger.info('socket.io 启动');
    return io;
}

export default useSocket;
import { JwtPayload, verify } from 'jsonwebtoken';
import socketio from 'socket.io';
import { Server } from "http";
import { CLIENT, JWT_SECRET } from '../../configs';
import logger from '../../logger';
import roomController from '../../controllers/roomController';
import { State } from '../../utils/FSM';
import userController from '../../controllers/userController';

interface ServerToClientEvents {
    'init': (src: string, currentTime: number) => void;
    'ready': () => void;
    'play': () => void;
    'pause': (currentTime: number) => void;
    'src': (src: string) => void;
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

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

const useSocket = (httpServer: Server) => {
    const io = new socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
        httpServer,
        {
            path: '/ws/',
            cors: {
                origin: CLIENT
            }
        }
    );

    // TODO: logger
    io.on('connection', async (socket) => {
        // 创建连接
        const { token } = socket.handshake.auth as { token: string };
        const { nickname } = socket.handshake.query as { nickname: string };
        // 验证token
        const tokenData = verify(token, JWT_SECRET) as JwtPayload;
        logger.info(`/ws token:${JSON.stringify(tokenData)}`);
        if ((tokenData.ip as string) !== socket.handshake.address) {
            socket.disconnect(true);
            return;
        }
        // 验证房间
        const roomDoc = await roomController.findById(tokenData.roomId as string);
        if (!roomDoc) {
            socket.disconnect(true);
            return;
        }
        // 创建用户
        const userDoc = await userController.create(nickname, socket.id);
        // 用户写入房间
        await roomController.join(roomDoc, userDoc._id);
        // 加入socket房间
        socket.join(roomDoc.id);
        logger.info(`join room:${roomDoc.id} user:${userDoc.id}`);

        // 客户端初始化
        socket.emit('init', roomDoc.src, roomDoc.currentTime);
        logger.info(`send init to ${userDoc.id}`);

        // 客户端初始化结束
        socket.on('init ready', async () => {
            logger.info(`recv init ready from ${userDoc.id}`);
            const currentState = await roomController.getState(roomDoc);
            switch (currentState) {
                case State.PLAYING:
                    socket.emit('play');
                    await userController.setState(userDoc, State.PLAYING);
                    break;
                case State.READY:
                    socket.emit('ready');
                    await userController.setState(userDoc, State.READY);
                    break;
            }
        });

        // 接收到ready
        socket.on('ready', async () => {
            const currentUserState = await userController.getState(userDoc);
            if (currentUserState === State.LOADING) {
                await userController.setState(userDoc, State.READY);
                const currentState = await roomController.getState(roomDoc);
                if (currentState === State.READY) {
                    io.to(roomDoc.id).emit('ready');
                }
            }
        });

        // 接收到play
        socket.on('play', async () => {
            const currentState = await roomController.getState(roomDoc);
            if (currentState === State.READY) {
                io.to(roomDoc.id).emit('play');
                await roomController.setState(roomDoc, State.PLAYING);
            }
        });

        // TODO: 接收到pause 给自己重复发送？
        socket.on('pause', async (currentTime: number) => {
            const currentUserState = await userController.getState(userDoc);
            if (currentUserState === State.PLAYING) {
                io.to(roomDoc.id).emit('pause', currentTime);
                roomController.setState(roomDoc, State.LOADING);
                roomController.setCurrentTime(roomDoc, currentTime);
            }
        });

        // socket.on('disconnect',async () => {
        //     const userId = userDoc.id;
        //     await redisClient.del(userId);
        //     await roomController.delete(userDoc);
        // })
    });

}

export default useSocket;
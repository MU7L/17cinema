import { WebSocketServer } from "ws";
import { User } from "../../db/schemas/User";
import server from '../../app';
import logger from "../../logger";

const enum State {
    INIT,       //表示初始化中，等待server的下一次同步
    LOADING,    //表示同步中，可能本地已经加载完成，但是需要等待server的ready指令
    PLAYING,    //表示正在同步播放中
    READY       //表示所有端已进度同步（一般不包括新加入），此时可以发送和接收play指令
}

interface WsMsg {
    topic: 'init' | 'play' | 'pause' | 'ready' | 'chat';
    msg: {
        user?: string | User,
        timestamp: number,
        currentTime?: number,
        currentSrc?: string,
        content?: string
    }
}

export default class WsRoom {
    src: string;
    currentTime: number;
    timer: number;
    userStates: Map<string, State>;
    wss: WebSocketServer;

    constructor(id: string) {
        this.src = 'https://s138.ananas.chaoxing.com/sv-w8/video/1e/46/00/6553b35d4110edf1137136a580289c24/sd.mp4';
        this.currentTime = 0;
        this.timer = (new Date()).getTime();
        this.userStates = new Map();
        this.wss = new WebSocketServer({
            server,
            path: `/ws/room/${id}`
        });
        this.initWss();
        logger.info(`create room ${id}`);
    }

    initWss() {
        this.wss.on('connection', (ws) => {
            let deltaTime = this.getState() === State.PLAYING ? ((new Date()).getTime() - this.timer) : 0;
            const initMsg: WsMsg = {
                topic: 'init',
                msg: {
                    timestamp: (new Date()).getTime(),
                    currentTime: this.currentTime + deltaTime,
                    currentSrc: this.src
                }
            }
            ws.send(JSON.stringify(initMsg));

            ws.on('message', (data) => {
                const recvMsg = JSON.parse(data.toString()) as WsMsg;
                logger.info(`recv ${data.toString()}`);
                let sendMsg: WsMsg = {
                    topic: 'play',
                    msg: {
                        timestamp: (new Date()).getTime()
                    }
                }
                const currentState = this.getState();
                console.log(currentState);

                switch (recvMsg.topic) {
                    case "init":
                        // 新用户加载完成发来init 根据集群状态回复
                        switch (currentState) {
                            case State.LOADING:
                                sendMsg.topic = 'pause';
                                this.userStates.set(recvMsg.msg.user as string, State.READY);
                                break;
                            case State.PLAYING:
                                sendMsg.topic = 'play';
                                this.userStates.set(recvMsg.msg.user as string, State.PLAYING);
                                break;
                            case State.READY:
                                sendMsg.topic = 'ready';
                                this.userStates.set(recvMsg.msg.user as string, State.READY);
                                break;
                        }
                        ws.send(JSON.stringify(sendMsg));
                        break;

                    case "play":
                        if (currentState === State.READY) {
                            this.timer = (new Date()).getTime();
                            sendMsg.topic = 'play';
                            this.wss.clients.forEach(c => {
                                c.send(JSON.stringify(sendMsg));
                            });
                            this.setStates(State.PLAYING);
                        }
                        break;

                    case "pause":
                        if (currentState === State.PLAYING) {
                            sendMsg.topic = 'pause';
                            if (recvMsg.msg.currentSrc) {
                                this.src = recvMsg.msg.currentSrc;
                                sendMsg.msg.currentSrc = recvMsg.msg.currentSrc;
                                this.currentTime = 0;
                                this.timestamp = (new Date()).getTime();
                                sendMsg.msg.currentTime = 0;
                            }
                            if (recvMsg.msg.currentTime) {
                                this.currentTime = recvMsg.msg.currentTime;
                                this.timestamp = (new Date()).getTime();
                                sendMsg.msg.currentTime = recvMsg.msg.currentTime;
                            }
                            this.wss.clients.forEach(c => {
                                if (c !== ws) {
                                    c.send(JSON.stringify(sendMsg));
                                }
                            });
                            this.setStates(State.LOADING);
                        }
                        break;

                    case "ready":
                        this.userStates.set(recvMsg.msg.user as string, State.READY);
                        if (this.getState() === State.READY) {
                            sendMsg.topic = 'ready';
                            this.wss.clients.forEach(c => {
                                c.send(JSON.stringify(sendMsg));
                            });
                        }
                        break;

                    case "chat":
                        // TODO: chat
                        break;

                    default: break;

                }
                logger.info(`send ${JSON.stringify(sendMsg)}`);
            });
        });
    }

    setCurrentTime(newCurrentTime: number) {
        this.currentTime = newCurrentTime;
        this.timer = (new Date()).getTime();
    }

    join(userId: string) {
        this.userStates.set(userId, State.INIT);
    }

    // 获取当前服务器状态 或者集群状态
    getState() {
        const stateSet = new Set(this.userStates.values());
        stateSet.delete(State.INIT);
        switch (stateSet.size) {
            case 0: return State.READY;
            case 1: return [...stateSet][0];
            case 2:
                if (stateSet.has(State.LOADING)) {
                    return State.LOADING;
                } else {
                    return State.INIT; // TODO: ready和playing同时存在是未曾设想的情况
                }
            default: return State.INIT;
        }
    }

    // 统一设置所有非init用户的状态
    setStates(state: State) {
        for (let key of this.userStates.keys()) {
            if (this.userStates.get(key) !== State.INIT) {
                this.userStates.set(key, state);
            }
        }
    }
}
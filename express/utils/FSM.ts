import { ClientToServerEvents } from "../router/ws";

export enum State {
    INIT = '初始化',    //接收到init信号后，表示初始化中，加载完成后会发送init，等待server的下一次同步
    LOADING = '同步中', //表示同步中，可能本地已经加载完成，但是需要等待server的ready指令
    PLAYING = '播放中', //表示正在同步播放中
    READY = '已同步'    //表示所有端已进度同步（一般不包括新加入），此时可以发送和接收play指令
}

const FSM = (state: State, event: keyof ClientToServerEvents) => {
    switch (state) {
        case State.INIT:
            if (event === "init ready") {
                return State.READY;
            }
        case State.LOADING:
            if (event === 'ready') {
                return State.READY;
            }
        case State.PLAYING:
            if (event === 'pause' || event === 'src') {
                return State.LOADING;
            }
        case State.READY:
            if (event === 'play' || event === 'src') {
                return State.PLAYING;
            }
        default:
            return State.LOADING;
    }
}

export default FSM;
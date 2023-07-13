import { ServerToClientEvents } from '@/utils/useSocket';
import { defineStore } from 'pinia'

export const enum State {
    INIT = '初始化',    //接收到init信号后，表示初始化中，加载完成后会发送init，等待server的下一次同步
    LOADING = '同步中', //表示同步中，可能本地已经加载完成，但是需要等待server的ready指令
    PLAYING = '播放中', //表示正在同步播放中
    READY = '已同步'    //表示所有端已进度同步（一般不包括新加入），此时可以发送和接收play指令
}

const useStateStore = defineStore('state', {
    state: () => ({ currentState: State.LOADING }),
    actions: {
        on(event: keyof ServerToClientEvents) {
            switch (this.currentState) {
                case State.INIT:
                    switch (event) {
                        case 'play': this.currentState = State.PLAYING; break;
                        case 'pause': this.currentState = State.LOADING; break;
                        case 'ready': this.currentState = State.READY; break;
                    }
                    break;
                case State.LOADING:
                    switch (event) {
                        case 'init': this.currentState = State.INIT; break;
                        case 'ready': this.currentState = State.READY; break;
                    }
                    break;
                case State.PLAYING:
                    if (event === 'pause') {
                        this.currentState = State.LOADING;
                    }
                    break;
                case State.READY:
                    if (event === 'play') {
                        this.currentState = State.PLAYING;
                    }
                    break;
            }
        },
    },
})

export default useStateStore;
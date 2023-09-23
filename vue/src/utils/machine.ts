import { ServerToClientEvents } from '@/utils/socketIO';
import { createMachine } from 'xstate';

export enum State {
    INIT = '初始化',    // 初始状态
    LOADING = '加载中', // 载入视频并跳转到时间点
    LOADED = '已加载',  // 等待根据服务器端指令进入指定状态
    SYNCING = '同步中',
    SYNCED = '已同步',
    PLAYING = '播放中'
}

type MachineEvent = { type: keyof ServerToClientEvents, currentTime?: number }

type MachineTypestate = {
    value: State;
    context: any;
}

const machine = createMachine<any, MachineEvent, MachineTypestate>({
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgDpBcJUGnNQNGUBiPbAFwG0AGAXUVAAcB7WW7D3VkAA9EARgBsIgg2nSAzAHYATCNmL5AVgAsAGhABPRAE4xBeQwAcsiyvNiGNgL4PdaLHkKACpUC+8YFo5CgCcwVAg9RhYkEE5uGl5+COEETSUCQ3NNWTE1K01jeV0DBGNTCytzGztHZxBXHHwCQCfdbwo2VABXWDAwgSiePgEE+U0TVPT1cw11Bky8-URxqUtZFQURc0NlMScXDFrCRq8AoJCuiJ6YvvjEQeG02TGJqbV8xFlDSRF5QyV1ER+liS21R27gaTTYABtUKFmN0uL04qABkMUrd7upJtNnolNJIxJ8zJplGV1LJATUQYAYFUAptZ+QLBaHhdhw84IoSiKayFJiczmBgk145NZYxSKTQpeRidR2dSfcwyiVk4F1erU5qQhmw6KxfqiVTyLnjMRiWQmwxjRTCrQpEkiZSKKUSRRGxVuOqAWpNAHymfha7U6MNOzO1lwQKjUBolxtN5qxZQIOUMqTuahxhjuTiquA4EDgAnJ+E18J1CAAtGIscX1CkE9WazXSVU84RSGQCyyi4SsSIRIYUrJNGspTLMipNC7dgRvD5W0HES8SSj0hL1KKRfaZgUuz3U-2zZKJco+2OQftpxdZwgJPqRgp7f35Dz1J3u72d4P9yOj3VqVOA1qz2zCleA08UMew1C+R9ZhDEQGAIKwE2kNYGDeA9Pz2alT1ZBJbQscNeVtCU0ktStNBtO0HVtZ0GyVQhPR-Jk-yw0Rl1gs0lg2IlhWUOMbR+LtkM0KZ5HTBwgA */
    id: 'machine',
    initial: State.INIT,
    states: {
        [State.INIT]: {
            on: {
                'init': {
                    target: State.LOADING,
                    actions: 'updateCurrentTime'
                }
            }
        },
        [State.LOADING]: {
            on: {
                'ready': {
                    target: State.LOADED,
                    actions: 'sendReady'
                }
            }
        },
        [State.LOADED]: {
            on: {
                'pause': {
                    target: State.SYNCING,
                    actions: 'updateCurrentTime'
                },
                'ready': State.SYNCED,
                'play': State.PLAYING
            }
        },
        [State.SYNCING]: {
            on: {
                'ready': {
                    target: State.SYNCED,
                    actions: 'sendReady'
                }
            }
        },
        [State.SYNCED]: {
            on: {
                'play': State.PLAYING
            }
        },
        [State.PLAYING]: {
            entry: 'play',
            on: {
                'pause': {
                    target: State.SYNCING,
                    actions: 'updateCurrentTime'
                }
            },
            exit: 'pause'
        }
    }
});

export default machine;

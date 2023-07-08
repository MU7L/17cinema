export const API_ADDR = 'http://localhost:3001/api';
export const WS_ADDR = 'ws://localhost:3001/ws/room';
export const enum State {
    LOADING,    //表示同步中，可能本地已经加载完成，但是需要等待server的ready指令
    INIT,       //表示初始化结束，等待server的下一次同步
    READY,      //表示所有端已进度同步（一般不包括新加入），此时可以发送和接收play指令
    PLAYING     //表示正在同步播放中
}
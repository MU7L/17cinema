import { WS_ADDR } from "@/configs";

interface WsMsg<Topic, Msg> {
    topic: Topic;
    msg: Msg
}

type CallBack<Msg> = (msg: Msg) => void;

class WebsocketHub<Topic, Msg> {
    private subsribers: Map<Topic, CallBack<Msg>[]>;
    private ws: WebSocket;

    constructor(room: string) {
        this.subsribers = new Map();
        this.ws = new WebSocket(`${WS_ADDR}/${room}`);
        this.ws.onopen = () => console.log('ws open');
        this.ws.onerror = console.error;
        this.ws.onclose = () => console.log('ws close');
        this.ws.onmessage = (e: MessageEvent) => {
            const data = JSON.parse(e.data) as WsMsg<Topic, Msg>;
            console.log('recv', data);
            this.messageHandler(data.topic, data.msg);
        }
    }

    on(topic: Topic, cb: CallBack<Msg>) {
        if (this.subsribers.has(topic)) {
            this.subsribers.get(topic)?.push(cb);
        } else {
            this.subsribers.set(topic, [cb])
        }
    }

    emit(topic: Topic, msg: Msg) {
        const sendMsg: WsMsg<Topic, Msg> = { topic, msg }
        console.log('send', sendMsg);
        this.ws.send(JSON.stringify(sendMsg));
    }

    private messageHandler(topic: Topic, msg: Msg) {
        this.subsribers.get(topic)?.forEach((cb: CallBack<Msg>) => {
            cb(msg);
        });
    }
}

export default function <Topic, Msg>(room: string) {
    return new WebsocketHub<Topic, Msg>(room);
}

import { RoomModel } from "../db";
import WsRoom from "../router/ws";

const roomMap = new Map<string, WsRoom>();

export const createRoom = async (title: string) => {

    // 生成邀请码
    const createInvitation = () => {
        let code = '';
        for (let i = 0; i < 5; i++) {
            let tmp = Math.floor(Math.random() * 36);
            if (tmp <= 9) {
                code += tmp.toString();
            } else {
                code += String.fromCodePoint(tmp + 55);
            }
        }
        return code;
    }

    const roomDoc = await RoomModel.create({
        title,
        invitation: createInvitation(),
        videoSrc: '',
        userList: [],
        msgList: []
    });

    roomMap.set(roomDoc.id, new WsRoom(roomDoc.id));
    return roomDoc;
}

export const findRoom = async (id: string) => {
    return await RoomModel.findById(id);
}

export const getWsRoom = (id: string) => {
    return roomMap.get(id);
}

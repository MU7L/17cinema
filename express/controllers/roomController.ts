import { Types, Document } from "mongoose";
import RoomModel, { IRoom } from "../models/RoomModel";
import redisClient from '../db/redis';
import { State } from "../utils/FSM";

export const invitationController = {
    code() {
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
    },

    gen(id: string, code: string) {
        return `${id}-${code}`;
    },

    parse(token: string) {
        if (!/.+-.+/.test(token)) {
            return null
        }
        const [roomId, code] = token.split('-');
        return { roomId, code };
    }
}

type RoomDoc = Document<unknown, {}, IRoom> & Omit<IRoom & {
    _id: Types.ObjectId;
}, never>

const roomController = {
    async create(title: string) {
        return await RoomModel.create({
            title: title,
            code: invitationController.code(),
            src: 'https://s138.ananas.chaoxing.com/sv-w8/video/1e/46/00/6553b35d4110edf1137136a580289c24/sd.mp4',
            currentTime: 0,
            userList: [],
            msgList: []
        });
    },

    async findById(roomId: string) {
        return await RoomModel.findById(roomId);
    },

    async join(roomDoc: RoomDoc, userId: Types.ObjectId) {
        roomDoc.userList.push(userId);
        await roomDoc.save();
    },

    async getState(roomDoc: RoomDoc) {
        const userStateList = await Promise.all(
            roomDoc.userList.map(
                async (userId: Types.ObjectId) => {
                    return await redisClient.get(userId.toString());
                }
            )
        ) as (State | null)[];
        const userStateSet = new Set(userStateList);
        userStateSet.delete(null);
        userStateSet.delete(State.INIT);
        if (userStateSet.size === 0) {
            return State.READY;
        } else if (userStateSet.size === 1) {
            return [...userStateSet][0] as State;
        } else if (userStateSet.size === 2) {
            if (userStateSet.has(State.LOADING)) {
                return State.LOADING;
            } else {
                return State.READY;
            }
        } else return State.LOADING;
    },

    async setState(roomDoc: RoomDoc, state: State) {
        await Promise.all(
            roomDoc.userList.map(
                async (userId: Types.ObjectId) => {
                    await redisClient.set(userId.toString(), state);
                }
            )
        );
    },

    async setCurrentTime(roomDoc: RoomDoc, newTime: number) {
        roomDoc.currentTime = newTime;
        roomDoc.save();
    }


}

export default roomController
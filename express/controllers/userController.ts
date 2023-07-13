import UserModel, { IUser } from "../models/UserModel";
import redisClient from '../db/redis';
import { State } from "../utils/FSM";
import { Types, Document } from "mongoose";

type UserDoc = Document<unknown, {}, IUser> & Omit<IUser & {
    _id: Types.ObjectId;
}, never>

export default {
    async create(nickname: string, socketId: string) {
        const userDoc = await UserModel.create({ nickname, socketId });
        await redisClient.set(userDoc.id, State.INIT);
        return userDoc;
    },

    async setState(userDoc: UserDoc, state: State) {
        await redisClient.set(userDoc.id, state);
    },

    async getState(userDoc: UserDoc) {
        return await redisClient.get(userDoc.id);
    }
}
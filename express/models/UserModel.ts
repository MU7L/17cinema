import { Schema, model } from "mongoose";
import { State } from "../utils/FSM";

export interface IUser {
    nickname: string;
    socketId: string;
    // state: '初始化'| '同步中'| '播放中'| '已同步';
    state: `${State}`;
}

export const UserSchema = new Schema<IUser>({
    nickname: { type: String, required: true, trim: true },
    socketId: { type: String, unique: true },
});

export default model<IUser>('User', UserSchema);
import { Schema, Types, model } from "mongoose";
import UserModel from "./UserModel";

export interface IRoom {
    title: string;
    code: string;
    src: string;
    currentTime: number;
    userList: Types.ObjectId[];
    msgList: Types.ObjectId[];
}

export const RoomSchema = new Schema<IRoom>({
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true },
    src: String,
    currentTime: Number,
    userList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    msgList: [{ type: Schema.Types.ObjectId, ref: 'Msg' }]
});

export default model<IRoom>('Room', RoomSchema);

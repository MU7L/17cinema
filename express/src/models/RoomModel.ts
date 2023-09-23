import { Schema, Types, model } from "mongoose";

export interface IRoom {
    title: string;
    invitation: string;
    src: string;
    currentTime: number;
    updateTime: number;
    userList: string[];
    msgList: Types.ObjectId[];
}

export const RoomSchema = new Schema<IRoom>({
    title: { type: String, trim: true },
    invitation: { type: String, trim: true },
    src: { type: String, trim: true },
    currentTime: { type: Number },
    updateTime: { type: Number },
    userList: [{ type: String }],
    msgList: [{ type: Schema.Types.ObjectId, ref: 'Msg' }]
});

const RoomModel = model<IRoom>('Room', RoomSchema);
export default RoomModel;

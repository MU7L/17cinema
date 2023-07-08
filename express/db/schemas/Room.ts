import { Schema, Document } from "mongoose";
import { User } from "./User";
import MsgSchema, { Msg } from './Msg';

export interface Room extends Document {
    id: string;
    title: string;
    invitation: string;
    videoSrc: string;
    userList: User[];
    msgList: Msg[];
}

export default new Schema<Room>({
    title: { type: String, required: true, trim: true },
    invitation: { type: String, required: true },
    msgList: [MsgSchema]
});


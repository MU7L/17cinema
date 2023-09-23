import { Schema, Types, model } from "mongoose";

export interface IMsg {
    time: Date;
    user: string;
    content: string;
}

export const MsgSchema = new Schema<IMsg>({
    time: { type: Date, default: Date.now() },
    user: { type: String },
    content: { type: String, required: true }
});

const MsgModel = model<IMsg>('Msg', MsgSchema);
export default MsgModel;

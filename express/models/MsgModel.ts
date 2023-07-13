import { Schema, Types } from "mongoose";

export interface IMsg {
    time: Date;
    user: Types.ObjectId;
    content: string;
}

export default new Schema<IMsg>({
    time: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
})
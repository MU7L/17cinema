import { Schema, Document } from "mongoose";
import UserSchema, { User } from './User';

export interface Msg extends Document {
    id: string;
    time: Date;
    user: User;
    content: string;
}

export default new Schema<Msg>({
    time: Date,
    user: UserSchema,
    content: String
})
import { Schema, Document } from "mongoose";

export interface User extends Document {
    id: string;
    nickname: string;
}

export default new Schema<User>({
    nickname: { type: String, required: true, trim: true }
});
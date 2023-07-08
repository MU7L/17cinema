import mongoose from "mongoose";
import MsgSchema, { Msg } from "./schemas/Msg";
import RoomSchema, { Room } from "./schemas/Room";
import UserSchema, { User } from "./schemas/User";
import logger from "../logger";

let db: mongoose.Connection | null = null;

export default async (dbUrl: string) => {
    await mongoose.connect(dbUrl);
    db = mongoose.connection as mongoose.Connection;
    db.on('error', console.error.bind(console, 'MongoDB连接错误: '));
    logger.info('数据库清空')
    await db.dropCollection('msgs');
    await db.dropCollection('rooms');
    await db.dropCollection('users');
}

export const MsgModel = mongoose.model<Msg>('msg', MsgSchema);
export const RoomModel = mongoose.model<Room>('room', RoomSchema);
export const UserModel = mongoose.model<User>('user', UserSchema);

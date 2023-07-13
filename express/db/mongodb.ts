import mongoose from "mongoose";
import logger from "../logger";
import { MONGO } from "../configs";

export default async () => {
    await mongoose.connect(MONGO);
    const db = mongoose.connection as mongoose.Connection;
    db.on('error', console.error.bind(console, 'MongoDB连接错误: '));
    logger.info('mongodb 启动');
    // await db.dropCollection('Msg');
    // await db.dropCollection('Room');
    // await db.dropCollection('User');
}

import mongoose from "mongoose";
import logger from "./logger";
import { MONGO } from "../configs";
import MsgModel from "../models/MsgModel";
import RoomModel from "../models/RoomModel";

const useMongo = async () => {
    const driver = await mongoose.connect(MONGO);
    logger.info('MongoDB 启动');
    // 初始化
    await MsgModel.deleteMany({});
    await RoomModel.deleteMany({});
}

export default useMongo;

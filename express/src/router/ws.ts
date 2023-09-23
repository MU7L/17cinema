import RoomModel from "../models/RoomModel";
import logger from "../utils/logger";
import { sign } from "jsonwebtoken";
import { SocketServer } from "../utils/socketio";

export default (io: SocketServer) => {
    io.on('connection', async socket => {
        const { roomId } = socket.handshake.query;
        const { invitation } = socket.handshake.auth;
        if (!roomId || !invitation) {
            socket.disconnect();
            return;
        }
        const roomDoc = await RoomModel.findById(roomId as string);
        if (!roomDoc) {
            socket.disconnect();
            return;
        }
        if (invitation !== roomDoc.invitation) {
            socket.disconnect();
            return;
        }
        roomDoc.userList.push(socket.id);
        await roomDoc.save();
        socket.join(roomId);
        logger.info(`link ${socket.id}`);
        // 通知其他人新成员加入
        io.to(roomId).emit('new', roomDoc.userList.length);
        // 同步新成员进度
        socket.emit('init', roomDoc.currentTime); // TODO: 时差算法
        socket.on('ready', () => {
            
        });
    });
}
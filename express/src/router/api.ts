import { Router } from "express";
import RoomModel from "../models/RoomModel";
import { randomString } from "../utils";
import logger from "../utils/logger";

const router = Router();

router.get('/rooms', async (req, res) => {
    const rooms = await RoomModel.estimatedDocumentCount({});
    res.send({
        code: 200,
        data: { rooms }
    });
    logger.info(`/rooms ${rooms}`);
});

// 房间信息
router.get('/rooms/:roomId', async (req, res) => {
    const roomId = req.params.roomId;
    const invitation = req.query.invitation as string;
    if (!invitation) {
        res.status(400).send({
            code: 400,
            message: '无邀请码'
        });
        return;
    }
    const roomDoc = await RoomModel.findById(roomId);
    if (!roomDoc) {
        res.status(404).send({
            code: 404,
            message: '该房间不存在'
        });
        return;
    }
    if (invitation !== roomDoc.invitation) {
        res.status(401).send({
            code: 401,
            message: '邀请码错误'
        });
        return;
    }
    res.send({
        code: 200,
        data: {
            title: roomDoc.title,
            src: roomDoc.src
        }
    });
    logger.info(`/room/${roomId} ${roomDoc.title}`);
});

// 创建
router.post('/create', async (req, res) => {
    let { title, src } = req.body as {
        title: string;
        src: string;
    };
    const roomDoc = new RoomModel({ title, src });
    roomDoc.invitation = randomString();
    await roomDoc.save();
    res.status(201).send({
        code: 201,
        data: {
            roomId: roomDoc.id,
            invitation: roomDoc.invitation
        }
    });
    logger.info(`/create room#${roomDoc.id} ${title}`);
});

export default router;
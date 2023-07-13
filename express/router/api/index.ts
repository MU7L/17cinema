import { Router } from "express";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import logger from "../../logger";
import { JWT_SECRET } from "../../configs";
import roomController, { invitationController } from "../../controllers/roomController";

// path: /api
const router = Router();

// 创建房间 获取通行证
interface CreateRecv {
    title: string;
}
router.post('/create', async (req, res) => {
    const recv = req.body as CreateRecv;
    logger.info(`api/create ${JSON.stringify(recv)}`);
    // 创建房间
    const roomDoc = await roomController.create(recv.title);
    // 生成token
    const token = sign({
        ip: req.ip,
        roomId: roomDoc.id
    }, JWT_SECRET);
    // console.log(req.ip);
    res.status(200).send({
        code: 200,
        data: {
            roomId: roomDoc.id,
            token,
        }
    });
});

// 加入房间 获取通行证
interface JoinRecv {
    invitation: string;
}
router.post('/join', async (req, res) => {
    const recv = req.body as JoinRecv;
    logger.info(`api/join ${JSON.stringify(recv)}`);
    const parseRes = invitationController.parse(recv.invitation);
    if (!parseRes) {
        // 邀请码格式错误
        res.status(400).send({
            code: 400,
            message: '邀请码格式错误'
        });
        return;
    }
    const roomDoc = await roomController.findById(parseRes.roomId);
    if (!roomDoc) {
        // 未查询到房间
        res.status(404).send({
            code: 404,
            message: '房间不存在'
        });
        return;
    }
    if (parseRes.code !== roomDoc.code) {
        // 验证邀请码
        res.status(400).send({
            code: 400,
            message: '邀请码错误'
        });
        return;
    }
    // 生成token
    const token = sign({
        ip: req.ip,
        roomId: roomDoc.id
    }, JWT_SECRET);   
    res.status(200).send({
        code: 200,
        data: {
            roomId: roomDoc.id,
            token
        }
    });
});

// 获取房间信息
router.get('/room/:id', async (req, res) => {
    const roomId = req.params.id;
    // 是否携带token
    if (!req.headers.authorization) {
        res.status(401).send({
            code: 401,
            message: '未登录'
        });
        return
    }
    const rawToken = req.headers.authorization.split(' ').pop() as string;
    const tokenData = verify(rawToken, JWT_SECRET) as JwtPayload;
    logger.info(`/room roomId:${roomId} token:${JSON.stringify(tokenData)}`);
    // 验证用户
    if(req.ip !== tokenData.ip) {
        res.status(401).send({
            code: 401,
            message: 'ip错误'
        });
        return
    }
    const roomDoc = await roomController.findById(tokenData.roomId);
    if (!roomDoc) {
        res.status(404).send({
            code: 404,
            message: '房间不存在'
        });
        return
    }
    res.status(200).send({
        code: 200,
        data: {
            title: roomDoc.title,
            invitation: invitationController.gen(roomDoc.id, roomDoc.code)
        }
    });
});

export default router;
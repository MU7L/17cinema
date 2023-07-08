// path: /api

import { Router } from "express";
import { createUser, findUser, createRoom, findRoom, getWsRoom } from "../../controlers";
import logger from "../../logger";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../configs";

const router = Router();

// 创建房间 获取通行证
interface CreateRecv {
    nickname: string;
    title: string;
}
router.post('/create', async (req, res) => {
    const recv = req.body as CreateRecv;
    logger.info(`/create ${JSON.stringify(recv)}`);
    try {
        // 创建用户
        const userDoc = await createUser(recv.nickname);
        // 创建房间 同时创建本地房间wss
        const roomDoc = await createRoom(recv.title);
        // 生成token
        const token = sign({
            userId: userDoc.id,
            roomId: roomDoc.id
        }, JWT_SECRET);
        res.status(200).send({
            code: 200,
            data: {
                userId: userDoc.id,
                roomId: roomDoc.id,
                token,
                invitation: roomDoc.invitation
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            msg: 'error'
        });
    }
});

// 加入房间 获取通行证
interface JoinRecv {
    nickname: string;
    roomId: string;
    invitation: string;
}
router.post('/join', async (req, res) => {
    const recv = req.body as JoinRecv;
    logger.info(`/join ${JSON.stringify(recv)}`);
    try {
        const roomDoc = await findRoom(recv.roomId);
        if (!roomDoc) {
            // 查询房间
            res.status(404).send({
                code: 404,
                msg: '该房间不存在'
            });
        } else if (recv.invitation !== roomDoc.invitation) {
            // 验证邀请码
            res.status(400).send({
                code: 400,
                msg: '邀请码错误'
            });
        } else {
            // 创建用户
            const userDoc = await createUser(recv.nickname);
            // 生成token
            const token = sign({
                userId: userDoc.id,
                roomId: roomDoc.id
            }, JWT_SECRET);
            res.status(200).send({
                code: 200,
                data: {
                    userId: userDoc.id,
                    roomId: roomDoc.id,
                    token
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            msg: 'error'
        });
    }
});

// 路由导航检查通行证 检查成功时将用户加入房间
interface CheckRecv {
    id: string;
}
router.post('/check', async (req, res) => {
    const recv: CheckRecv = req.body;
    if (!req.headers.authorization) {
        res.status(400).send({
            code: 400,
            msg: '未携带authorization'
        });
        return
    }
    const rawToken = req.headers.authorization.split(' ').pop();
    if (!rawToken) {
        res.status(400).send({
            code: 400,
            msg: '未携带token'
        });
        return
    }
    const tokenData = verify(rawToken, JWT_SECRET) as JwtPayload;
    logger.info(`/check id:${recv.id} token:${JSON.stringify(tokenData)}`);
    if (tokenData.userId !== recv.id) {
        res.status(400).send({
            code: 400,
            msg: '非法token: id错误'
        });
        return
    }
    const userDoc = await findUser(tokenData.userId);
    const roomDoc = await findRoom(tokenData.roomId);
    if (!userDoc || !roomDoc) {
        res.status(400).send({
            code: 400,
            msg: '非法token: 用户或房间不存在'
        });
        return
    }
    const wsRoom = getWsRoom(roomDoc.id);
    if(!wsRoom) {
        res.status(500).send({
            code: 500,
            msg: '房间创建失败'
        });
        return
    }
    wsRoom.join(userDoc.id);
    res.status(200).send({
        code: 200
    });
});

router.get('/room/:id',async (req,res)=>{
    const id = req.params.id;
    const roomDoc = await findRoom(id);
    if(!roomDoc){
        res.status(404).send({
            code:404,
            msg:'房间不存在'
        })
    } else {
        res.status(200).send({
            code:200,
            data:{
                title:roomDoc.title,
                invitation:roomDoc.invitation
            }
        })
    }
})

export default router;
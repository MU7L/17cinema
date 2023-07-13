import express from "express";
import { createServer } from "http";
import cors from 'cors';
import router from './router/api';
import useMongo from './db/mongodb';
import { useRedis } from "./db/redis";
import { PORT, CLIENT } from "./configs";
import logger from "./logger";
import useSocket from "./router/ws";

useMongo();
useRedis();

const app = express();
const httpServer = createServer(app);

// 跨域
app.use(cors({
    origin: CLIENT,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT']
}));

// 解析json
app.use(express.json());

// api 模块
app.use('/api', router);

// ws 模块
useSocket(httpServer);

app.get('/', (req, res) => {
    res.send(`<a href="${CLIENT}">17cinema</a>`);
});

httpServer.listen(3001);
// app.listen(3001)
logger.info(`服务器运行于: http://localhost:${PORT}`);

export default httpServer;

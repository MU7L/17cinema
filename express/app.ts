import express from "express";
import apiRouter from './router/api';
import initDB from './db';
import { DB_URL, PORT, CLIENT } from "./configs";
import cors from 'cors';
import logger from "./logger";


logger.info('服务器启动')
// 连接数据库
logger.info('连接数据库');
initDB(DB_URL);

const app = express();

// 跨域
app.use(cors({
    origin: CLIENT,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT']
}));

// 解析json
app.use(express.json());

// api 模块
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send(`<a url="${CLIENT}">17cinema</a>`);
})

export default app.listen(PORT, () => {
    logger.info(`服务器运行于: http://localhost:${PORT}`);
});
import express from 'express';
import logger from './utils/logger';
import { CLIENT, PORT } from './configs';
import router from './router/api';
import useMongo from './utils/mongodb';
import { createServer } from 'http';
import useSocket from './utils/socketio';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: CLIENT // 指定允许的来源
}));

app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('ok');
});

export const io = useSocket(httpServer);

const setup = async () => {
    await useMongo();
    httpServer.listen(PORT);
}

setup().catch(err => {
    logger.error(err);
    process.exit(1);
});

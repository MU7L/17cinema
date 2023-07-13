import { createClient } from 'redis';
import logger from '../logger';

const client = createClient();

client.on('error', err => console.error('Redis Client Error', err));

export const useRedis = async () => {
    await client.connect();
    logger.info('redis 启动');
} 

export default client;

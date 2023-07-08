/*
Node.js 18 将默认 DNS 解析排序从始终优先 ipv4 更改为排序 由 DNS 提供商返回。
在某些环境中，这可能会导致解析为 IPv6 地址而不是 IPv4，从而导致无法连接到服务器。
使用 127.0.0.1 代替 localhost
*/
export const DB_URL = 'mongodb://127.0.0.1/17cinema';
export const JWT_SECRET = '114514';
export const PORT = 3001;
export const CLIENT = 'http://localhost:5173';

// 随机生成五位大写字母或数字的字符串
export const randomString = (len: number = 5) => {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
}

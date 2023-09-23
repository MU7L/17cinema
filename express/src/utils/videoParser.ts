import logger from './logger';
import fs from 'fs';
import superagent from 'superagent';
import { load } from 'cheerio';

const writeFile = (content: string): void => {
    fs.writeFile('temp.html', content, { flag: 'w' }, (err) => {
        if (err) {
            console.error(err);
        }
    })
}

const getPage = async (url: string): Promise<string> => {
    logger.info('get page...');
    return new Promise((resolve, reject) => {
        superagent.get(url)
            .end((err, res) => {
                if (err) {
                    logger.error(err);
                    reject(err);
                } else {
                    writeFile(res.text);
                    resolve(res.text);
                }
            });
    });

}

const getVideo = (page: string): string[] => {
    logger.info('get video...');
    const $ = load(page);
    const srcList: string[] = [];
    $('video').each((i, el) => {
        const src = $(el).attr('src');
        console.log(src);
        if (src) {
            srcList.push(src);
        }
    });
    return srcList;
}

// TODO
const parser = async (url: string): Promise<string[]> => {
    const page = await getPage(url);
    const res = getVideo(page);
    logger.info(`ok ${res}`);
    return res;
}

export default parser;
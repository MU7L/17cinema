import { createLogger, format, transports } from 'winston';

const formatter = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.align(),
    format.printf(info => `[${info.level}] ${[info.timestamp]} ${info.message}`)
);

// log to console
const transportsConsole = new transports.Console({ format: formatter });

// log to records.log
const transportsFile = new transports.File({
    filename: "./logs/server.log",
    format: formatter
});

const logger = createLogger({
    transports: [
        transportsConsole,
        // transportsFile
    ]
});

export default logger;
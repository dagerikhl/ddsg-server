const winston = require('winston');

const format = winston.format;

const myFormat = format.printf((info) => {
    const timestamp = (new Date()).toLocaleTimeString();

    let parsedMessage;
    if (typeof info.message !== 'string' && Object.keys(info.message).length > 1) {
        parsedMessage = `\n${JSON.stringify({ ...info.message }, null, 2)}`;
    } else if (typeof info.message !== 'string') {
        parsedMessage = `${JSON.stringify(info.message)}`;
    } else {
        parsedMessage = info.message;
    }

    let logMessage = `${timestamp} ${info.level}: ${parsedMessage}`;

    return logMessage;
});

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(format.colorize(), myFormat),
    transports: [
        new winston.transports.Console({
            level: 'silly'
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'combined.log'
        })
    ]
});

global.logger = logger;

const winston = require('winston');

const format = winston.format;

const myFormatWithTimeFormat = (timeFormat) => {
    let time = new Date();

    switch (timeFormat) {
    case 'local-time':
        return myFormatWithTimestamp(time.toLocaleTimeString());
    case 'iso':
    default:
        return myFormatWithTimestamp(time.toISOString());
    }
};

const myFormatWithTimestamp = (timestamp) => format.printf((info) => {
    let parsedMessage;
    if (info.message && typeof info.message !== 'string' && Object.keys(info.message).length > 1) {
        parsedMessage = `\n${JSON.stringify({ ...info.message }, null, 2)}`;
    } else if (typeof info.message !== 'string') {
        parsedMessage = `${JSON.stringify(info.message)}`;
    } else {
        parsedMessage = info.message;
    }

    const logMessage = `${timestamp} ${info.level}: ${parsedMessage}`;

    return logMessage;
});

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            level: 'silly',
            format: format.combine(format.colorize(), myFormatWithTimeFormat('local-time'))
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'error.log',
            format: myFormatWithTimeFormat('iso')
        }),
        new winston.transports.File({
            filename: 'combined.log',
            format: myFormatWithTimeFormat('iso')
        })
    ]
});

global.logger = logger;

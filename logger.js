const winston = require('winston');

const timeFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: timeFormat,
            colorize: true
        })
    ]
});

// Set log level according to environment
if (process.env.NODE_ENV === 'production') {
    logger.level = 'info';
} else if (process.env.NODE_ENV === 'development') {
    logger.level = 'debug';
} else if (process.env.NODE_ENV === 'test') {
    logger.level = 'debug';
}

global.logger = logger;

const dotenv = require('dotenv');
const express = require('express');
const schedule = require('node-schedule');

const updatePipe = require('./app/services/update-pipe/update-pipe');

// Configuration
dotenv.config();

// Expose logger
require('./logger');

// Register Express app
const app = express();

// Register routes
require('./app/routes')(app);

// Listen on port, and specific host if specified
const port = +(process.env.port || port || 8000);
// DEBUG
console.log(process.env.port);
console.log(process.env.PORT);
console.log(port);
// DEBUG
if (process.env.HOST) {
    app.listen(port, process.env.HOST, () => {
        logger.info(`Server started on host ${process.env.HOST} on port ${port}. Listening...`);
    });
} else {
    app.listen(port, () => {
        logger.info(`Server started on port ${port}. Listening...`);
    });
}

// Keep data up to date
if (process.env.NODE_ENV === 'production') {
    // Update entities on a schedule, CRON syntax: '0 30 * * *' = once a day at 00:30
    schedule.scheduleJob('0 30 * * *', updatePipe.fetchUpdatedDataFromSources);
} else if (process.env.NODE_ENV === 'development') {
    updatePipe.fetchUpdatedDataFromSources();
} else if (process.env.NODE_ENV === 'test') {
    updatePipe.fetchUpdatedDataFromSources();
}

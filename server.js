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
const host = process.env.HOST;
const port = +(process.env.PORT || 8000);
if (host) {
    app.listen(port, host, () => {
        logger.info(`Server started on host ${host} on port ${port}.`);
        scheduleUpdates();
    });
} else {
    app.listen(port, () => {
        logger.info(`Server started on port ${port}.`);
        scheduleUpdates();
    });
}

function scheduleUpdates() {
    // Force an update if the server persists the entities in memory
    if (process.env.USE_FILE_SYSTEM === 'false') {
        updatePipe.fetchUpdatedDataFromSources();
    }

    if (process.env.NODE_ENV === 'production') {
        // Update entities on a schedule, CRON syntax: '0 30 * * *' = once a day at 00:30
        schedule.scheduleJob('0 30 * * *', updatePipe.fetchUpdatedDataFromSources);
    } else if (process.env.NODE_ENV === 'development') {
        updatePipe.fetchUpdatedDataFromSources();
    } else if (process.env.NODE_ENV === 'test') {
        updatePipe.fetchUpdatedDataFromSources();
    }
}

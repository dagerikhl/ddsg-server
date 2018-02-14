const express = require('express');
const schedule = require('node-schedule');

const config = require('./config');

const updatePipe = require('./app/services/update-pipe/update-pipe');

// Update entities on a schedule, CRON syntax: '0 0 * * *' = once a day at 00:00
schedule.scheduleJob('0 0 * * *', updatePipe.updateEntitiesFromDataSources);

// Register Express app
const app = express();

// Register routes
require('./app/routes')(app);

// Listen on port
app.listen(config.server.port, () => {
    console.log('Server started on port ' + config.server.port + '. Listening...');
});

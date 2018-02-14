const express = require('express');
const schedule = require('node-schedule');

// Register Express app
const app = express();

// Configuration
const port = 8000;

// Register routes
require('./app/routes')(app);

// Listen on port
app.listen(port, () => {
    console.log('Server started on port ' + port + '. Listening...');
});

// CRON syntax: '0 0 * * *' = once a day, at 00:00
schedule.scheduleJob('0 0 * * *', updateEntitiesFromDataSources);

function updateEntitiesFromDataSources() {
    // Fetch CAPEC source
    const capecVersion = getNewestVersionOfSource('capec');
    const capecData = fetchCapecData(capecVersion);

    // Fetch CWE source
    const cweVersion = getNewestVersionOfSource('cwe');
    const cweData = fetchCweData(cweVersion);

    const entities = generateEntities(capecData, cweData);

    const data = {
        timestamp: Date.now() || new Date().getTime(),
        entities: entities
    };

    setFileContent('entities', data);
}

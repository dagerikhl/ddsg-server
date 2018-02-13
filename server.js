const express = require('express');

// Register Express app
const app = express();

// Configuration
const port = 8000;

// Register routes
require('./app/routes')(app, {});

// Listen on port
app.listen(port, () => {
    console.log('Server started on port ' + port + '. Listening...');
});

// Update data from sources
// TODO Setup listening on data sources at intervals

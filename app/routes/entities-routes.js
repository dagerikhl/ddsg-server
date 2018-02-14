const fileHandler = require('../services/file-handler');

module.exports = (app) => {
    app.get('/entities', (req, res) => {
        console.log(`Serving: ${req.method} ${req.headers.host || ''}${req.url}`);

        const content = fileHandler.getFileContent('entities');
        res.json(content);
    });
};

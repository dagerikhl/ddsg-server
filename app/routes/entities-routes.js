const fileHandler = require('../services/file-handler');

module.exports = (app) => {
    app.get('/entities', (req, res) => {
        console.log(`Serving: ${req.method} ${req.headers.host || ''}${req.url}`);

        const rawContent = fileHandler.getFileContent('entities.json');
        const jsonContent = JSON.parse(rawContent);
        res.json(jsonContent);
    });
};

const fileHandler = require('../services/file-handler');

module.exports = (app) => {
    app.get('/entities', (req, res) => {
        const content = fileHandler.getFileContent('entities');
        res.json(content);
    });
};

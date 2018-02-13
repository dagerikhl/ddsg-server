import { FileHandler } from '../services/file-handler';

const fileHandler = new FileHandler();

module.exports = (app) => {
    app.get('/entities', (req, res) => {
        res.json(fileHandler.getFileContent('entities'));
    });
};

module.exports = (app) => {
    app.get('/entities', (req, res) => {
        const content = getFileContent('entities');
        res.json(content);
    });
};

module.exports = (app) => {
    app.get('/entities', (req, res) => {
        // TODO Impl. serving of actual object file from endpoint
        res.json({ 'TEST': 'This is a test.' });
    });
};

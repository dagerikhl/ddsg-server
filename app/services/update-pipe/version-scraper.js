const Xray = require('x-ray');

const xray = Xray();

function getNewestVersionOfSource(source, cb) {
    switch (source.toLowerCase()) {
    case 'capec':
        xray('https://capec.mitre.org/data/index.html', '.header')((err, res) => {
            if (err) {
                logger.error(error);
            }

            const version = res.match(/(\d\.?)+/g)[0];
            cb(version);
        });
        break;
    case 'cwe':
        xray('https://cwe.mitre.org/data/index.html', '.header')((err, res) => {
            if (err) {
                logger.error(error);
            }

            const version = res.match(/(\d\.?)+/g)[0];
            cb(version);
        });
        break;
    default:
        throw `Data source does not exist: ${source}`;
    }
}

module.exports = {
    getNewestVersionOfSource
};

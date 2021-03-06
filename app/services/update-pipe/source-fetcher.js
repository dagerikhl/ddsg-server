const xmljs = require('xml-js');

const fileHandler = require('../file-handler');
const httpClient = require('../http-client');

function fetchCapecData(version, cb) {
    logger.info('Fetching CAPEC source...');
    if (process.env.USE_FILE_SYSTEM === 'true' && process.env.LOCAL_JSON_USE === 'true') {
        cb(JSON.parse(fileHandler.getFileContent('capecObjects.json')));
        return;
    }

    httpClient.get(`https://capec.mitre.org/data/xml/capec_v${version}.xml`, (res) => {
        logger.info('Fetching CAPEC source... Done.');
        const json = xmljs.xml2js(res, { compact: true });
        cb(json);
    });
}

module.exports = {
    fetchCapecData
};

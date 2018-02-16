const xmljs = require('xml-js');

const fileHandler = require('../file-handler');
const httpClient = require('../http-client');

function fetchCapecData(version, cb) {
    // TODO Replace DEBUG with real code
    // httpClient.get(`https://capec.mitre.org/data/xml/capec_v${version}.xml`, (res) => {
    //     const json = xmljs.xml2js(res, { compact: true });
    //     cb(json);
    // });

    // DEBUG
    cb(JSON.parse(fileHandler.getFileContent('capecObjects.json')));
}

function fetchCweData(version, cb) {
    // TODO Replace DEBUG with real code
    // const zipFileName = `cwec_v${version}.xml.zip`;
    // const entryFileName = `cwec_v${version}.xml`;
    //
    // httpClient.getBinary(`https://cwe.mitre.org/data/xml/cwec_v${version}.xml.zip`, (res) => {
    //     fileHandler.setFileContent(zipFileName, res);
    //
    //     fileHandler.extractEntryFromZipFile(zipFileName, entryFileName, () => {
    //         const xml = fileHandler.getFileContent(entryFileName);
    //         const json = xmljs.xml2js(xml, { compact: true });
    //
    //         // Clean up temp files
    //         fileHandler.removeFile(zipFileName);
    //         fileHandler.removeFile(entryFileName);
    //
    //         cb(json);
    //     });
    // });

    // DEBUG
    cb(JSON.parse(fileHandler.getFileContent('cweObjects.json')));
}

module.exports = {
    fetchCapecData,
    fetchCweData
};

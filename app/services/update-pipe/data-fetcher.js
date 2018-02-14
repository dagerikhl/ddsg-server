const xmljs = require('xml-js');

const httpClient = require('../http-client');

function fetchCapecData(version, cb) {
    httpClient.get(`https://capec.mitre.org/data/xml/capec_v${version}.xml`, (res) => {
        const json = xmljs.xml2js(res, { compact: true });
        cb(json);
    });
}

function fetchCweData(version, cb) {
    httpClient.get(`https://cwe.mitre.org/data/xml/cwec_v${version}.xml.zip`, (res) => {
        // TODO Process ZIP
        const unzipped = res;
        const json = xmljs.xml2js(unzipped, { compact: true });
        cb(json);
    });
}

module.exports = {
    fetchCapecData,
    fetchCweData
};

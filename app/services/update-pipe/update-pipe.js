const fileHandler = require('../file-handler');

const versionScraper = require('./version-scraper');
const dataFetcher = require('./data-fetcher');
const entitiesGenerator = require('./entities-generator');

function updateEntitiesFromDataSources() {
    // Fetch CAPEC source
    versionScraper.getNewestVersionOfSource('capec', (version) => {
        console.log(version);
        dataFetcher.fetchCapecData(version, (data) => {
            // TODO
            console.log(data);
        });
    });

    // Fetch CWE source
    versionScraper.getNewestVersionOfSource('cwe', (version) => {
        console.log(version);
        dataFetcher.fetchCweData(version, (data) => {
            // TODO
            console.log(data);
        });
    });

    // const entities = entitiesGenerator.generateEntities(capecData, cweData);

    // const data = {
    //     timestamp: Date.now() || new Date().getTime(),
    //     entities
    // };
    //
    // fileHandler.setFileContent('entities', data);
}

module.exports = {
    updateEntitiesFromDataSources
};

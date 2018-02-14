const fileHandler = require('../file-handler');

const versionScraper = require('./version-scraper');
const dataFetcher = require('./data-fetcher');
const entitiesGenerator = require('./entities-generator');

function updateEntitiesFromDataSources() {
    // Fetch CAPEC source
    // versionScraper.getNewestVersionOfSource('capec', (version) => {
    //     // DEBUG
    //     console.log(version);
    //     dataFetcher.fetchCapecData(version, (data) => {
    //         // DEBUG
    //         console.log(data);
    //         const capecObjects = data['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern'];
    //         // DEBUG
    //         console.log(capecObjects);
    //         // TODO Make use of these objects, along with CWE, to make entities.
    //         // TODO Filter results on OWASP Top 10
    //     });
    // });

    // TODO Impl. the same way as CAPEC above when finished
    // Fetch CWE source
    versionScraper.getNewestVersionOfSource('cwe', (version) => {
        // DEBUG
        console.log(version);
        dataFetcher.fetchCweData(version, (data) => {
            // DEBUG
            console.log(data);
            // TODO Filter out relevant objects from source data
            const cweObjects = data;
            // TODO Make use of these objects
            // TODO Filter results on OWASP Top 10
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

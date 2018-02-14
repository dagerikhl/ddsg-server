const versionScraper = require('./version-scraper');
const dataFetcher = require('./data-fetcher');
const entitiesGenerator = require('./entities-generator');

function updateEntitiesFromDataSources() {
    // Fetch CAPEC source
    const capecVersion = versionScraper.getNewestVersionOfSource('capec');
    const capecData = dataFetcher.fetchCapecData(capecVersion);

    // Fetch CWE source
    const cweVersion = versionScraper.getNewestVersionOfSource('cwe');
    const cweData = dataFetcher.fetchCweData(cweVersion);

    const entities = entitiesGenerator.generateEntities(capecData, cweData);

    const data = {
        timestamp: Date.now() || new Date().getTime(),
        entities: entities
    };

    setFileContent('entities', data);
}

module.exports = {
    updateEntitiesFromDataSources
};

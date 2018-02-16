const fileHandler = require('../file-handler');

const versionScraper = require('./version-scraper');
const dataFetcher = require('./data-fetcher');
const entitiesGenerator = require('./entities-generator');

// State
let capecObjects = null;
let cweObjects = null;

function updateEntitiesFromDataSources() {
    console.log('Updating data from sources...');

    // Fetch CAPEC source
    versionScraper.getNewestVersionOfSource('capec', (version) => {
        dataFetcher.fetchCapecData(version, (data) => {
            // DEBUG
            // fileHandler.setFileContent('capecObjects.json', JSON.stringify(data));
            const capecAllObjects = data['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern'];
            // TODO Filter results on OWASP Top 10
            capecObjects = /* TODO Filter */capecAllObjects;

            generateEntitiesFromAllSources(capecObjects, cweObjects);
        });
    });

    // Fetch CWE source
    versionScraper.getNewestVersionOfSource('cwe', (version) => {
        dataFetcher.fetchCweData(version, (data) => {
            // DEBUG
            // fileHandler.setFileContent('cweObjects.json', JSON.stringify(data));
            const cweAllObjects = data['Weakness_Catalog']['Weaknesses']['Weakness'];
            // TODO Filter results on OWASP Top 10
            cweObjects = /* TODO Filter */cweAllObjects;

            generateEntitiesFromAllSources(capecObjects, cweObjects);
        });
    });
}

function generateEntitiesFromAllSources(capecObjects, cweObjects) {
    // Only generate when we have all sources
    if (!capecObjects || !cweObjects) {
        return;
    }

    entitiesGenerator.generateEntities(capecObjects, cweObjects, (entities) => {
        const data = {
            timestamp: Date.now() || new Date().getTime(),
            entities
        };

        const jsonData = JSON.stringify(data);
        fileHandler.setFileContent('entities.json', jsonData);

        // Clear local variables
        capecObjects = null;
        cweObjects = null;

        console.log('Done updating data from sources.');
    });
}

module.exports = {
    updateEntitiesFromDataSources
};

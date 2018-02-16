const fileHandler = require('../file-handler');

const dataFetcher = require('./data-fetcher');
const entitiesGenerator = require('./entities-generator');
const filterer = require('./filterer');
const versionScraper = require('./version-scraper');

// Local state
let objects = {
    capecObjects: null,
    cweObjects: null,
    capecObjectsFiltered: null,
    cweObjectsFiltered: null
};

let activeFilters = [
    'owasp'
];

function fetchUpdatedDataFromSources() {
    console.log('Updating data from sources...');

    // Fetch CAPEC source
    versionScraper.getNewestVersionOfSource('capec', (version) => {
        dataFetcher.fetchCapecData(version, (data) => {
            objects.capecObjects = data['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern'];

            if (process.env.LOCAL_JSON_STORE === 'true') {
                fileHandler.setFileContent('capecObjects.json', JSON.stringify(data, null, 4));
                fileHandler.setFileContent('attackPatterns.json', JSON.stringify(objects.capecObjects, null, 4));
            }

            filterAndGenerateEntities();
        });
    });

    // Fetch CWE source
    versionScraper.getNewestVersionOfSource('cwe', (version) => {
        dataFetcher.fetchCweData(version, (data) => {
            objects.cweObjects = data['Weakness_Catalog']['Weaknesses']['Weakness'];

            if (process.env.LOCAL_JSON_STORE === 'true') {
                fileHandler.setFileContent('cweObjects.json', JSON.stringify(data, null, 4));
                fileHandler.setFileContent('weaknesses.json', JSON.stringify(objects.cweObjects, null, 4));
            }

            filterAndGenerateEntities();
        });
    });
}

function filterAndGenerateEntities() {
    // Only proceed when we have fetched all sources
    if (!objects.capecObjects || !objects.cweObjects) {
        return;
    }

    filterer.filter(objects, activeFilters);
    entitiesGenerator.generateEntities(objects, saveEntities);
}

function saveEntities(entities) {
    const data = {
        timestamp: Date.now() || new Date().getTime(),
        entities
    };

    const jsonData = JSON.stringify(data);
    fileHandler.setFileContent('entities.json', jsonData);

    // Clear local state
    objects = {};

    console.log('Done updating data from sources.');
}

module.exports = {
    fetchUpdatedDataFromSources
};

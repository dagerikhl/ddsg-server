const fileHandler = require('../file-handler');
const utilities = require('../utilities');

const sourceFetcher = require('./source-fetcher');
const entitiesGenerator = require('./entities-generator');
const filterer = require('./filterer');
const versionScraper = require('./version-scraper');

// Local configuration
const activeFilters = [
    'deprecated',
    'owasp'
];

// Local state
let objects = {
    capecObjects: null,
    capecObjectsFiltered: null
};

function fetchUpdatedDataFromSources() {
    logger.info('Updating data from sources...');

    // Fetch CAPEC source
    versionScraper.getNewestVersionOfSource('capec', (version) => {
        sourceFetcher.fetchCapecData(version, (data) => {
            objects.capecObjects = data;

            if (process.env.LOCAL_JSON_STORE === 'true') {
                fileHandler.setFileContent('capecObjects.json', JSON.stringify(data, null, 4));
            }

            filterAndGenEntities();
        });
    });
}

function filterAndGenEntities() {
    // Only proceed when we have fetched all sources
    if (!objects.capecObjects) {
        return;
    }

    filterer.filterByActiveFilters(objects, activeFilters);
    entitiesGenerator.genStixEntities(objects, saveEntities);
}

function saveEntities(entities) {
    const data = {
        created: utilities.timestamp(),
        entities
    };

    let jsonData;
    if (process.env.NODE_ENV === 'development') {
        jsonData = JSON.stringify(data, null, 4);
    } else {
        jsonData = JSON.stringify(data);
    }
    fileHandler.setFileContent('entities.json', jsonData);

    // Clear local state
    objects = {};

    logger.info('Updating data from sources... Done.');
}

module.exports = {
    fetchUpdatedDataFromSources
};

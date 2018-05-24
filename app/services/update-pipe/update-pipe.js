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

    return new Promise((resolve, reject) => {
        // Fetch CAPEC source
        versionScraper.getNewestVersionOfSource('capec', (version) => {
            sourceFetcher.fetchCapecData(version, (data) => {
                objects.capecObjects = data;

                if (process.env.USE_FILE_SYSTEM === 'true' && process.env.LOCAL_JSON_STORE === 'true') {
                    fileHandler.setFileContent('capecObjects.json', JSON.stringify(data, null, 4));
                }

                filterAndGenEntities(resolve, reject);
            });
        });
    });
}

function filterAndGenEntities(resolve, reject) {
    // Only proceed when we have fetched all sources
    if (!objects.capecObjects) {
        logger.info('Attempting to filter and generate entities, but not all sources have finished fetching.');

        reject();
        return;
    }

    filterer.filterByActiveFilters(objects, activeFilters);
    const stixEntities = entitiesGenerator.genStixEntities(objects);

    saveEntities(stixEntities, resolve, reject);
}

function saveEntities(entities, resolve, reject) {
    const data = {
        created: utilities.timestamp(),
        entities
    };

    if (process.env.USE_FILE_SYSTEM === 'true') {
        let jsonData;
        if (process.env.NODE_ENV === 'development') {
            jsonData = JSON.stringify(data, null, 4);
        } else {
            jsonData = JSON.stringify(data);
        }
        fileHandler.setFileContent('entities.json', jsonData);
    } else {
        global.entities = data;
    }

    // Clear local state
    objects = {};

    logger.info('Updating data from sources... Done.');

    resolve();
}

module.exports = {
    fetchUpdatedDataFromSources
};

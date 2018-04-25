const utilities = require('../utilities');

function filterByActiveFilters(objects, activeFilters) {
    // Set filtered objects to all objects initially
    objects.capecObjectsFiltered = objects.capecObjects;

    for (let filter of activeFilters) {
        if (filter.toLowerCase() === 'deprecated') {
            byDeprecated(objects);
        } else if (filter.match(/capec:\d+(,\d+)+/)) {
            byCapecIds(objects, filter.split(':')[1].split(','));
        } else if (filter.match(/capec:\d+/)) {
            byCapecId(objects, filter.split(':')[1]);
        } else if (filter.toLowerCase() === 'owasp') {
            byOwaspTop10(objects);
        } else {
            logger.warn('No filter was found for active filter:', filter);
        }
    }
}

function byDeprecated(objects) {
    const keys = [
        'capec:Attack_Pattern_Catalog',
        'capec:Attack_Patterns',
        'capec:Attack_Pattern'
    ];

    objects.capecObjectsFiltered[keys[0]][keys[1]][keys[2]] = objects.capecObjectsFiltered[keys[0]][keys[1]][keys[2]]
        .filter((e) => e['_attributes']['Status'].toLowerCase() !== 'deprecated');
}

function byCapecIds(objects, ids) {
    const keys = [
        'capec:Attack_Pattern_Catalog',
        'capec:Attack_Patterns',
        'capec:Attack_Pattern'
    ];

    objects.capecObjectsFiltered[keys[0]][keys[1]][keys[2]] = objects.capecObjectsFiltered[keys[0]][keys[1]][keys[2]]
        .filter((e) => ids.includes(e['_attributes']['ID']));
}

function byCapecId(objects, id) {
    const keys = [
        'capec:Attack_Pattern_Catalog',
        'capec:Attack_Patterns',
        'capec:Attack_Pattern'
    ];

    objects.capecObjectsFiltered[keys[0]][keys[1]][keys[2]] = objects.capecObjectsFiltered[keys[0]][keys[1]][keys[2]]
        .filter((e) => e['_attributes']['ID'] === id);
}

/**
 * The ids here are directly extracted from CWE's Category view of OWASP Top 10 and their related attack patterns at:
 * https://cwe.mitre.org/data/definitions/1026.html
 *
 * The attack patterns that are included are: direct children of each category, and recursively direct children of
 * any categories that are direct children.
 *
 * They are split into the different categories of OWASP Top 10: A1-10 for tracability. Duplicates have been
 * included for the same reason, but are filtered for performance.
 */
function byOwaspTop10(objects) {
    const a1Ids = [
        11, 136, 15, 23, 248, 43, 6, 75, 76, 108, 15, 43, 6, 88, 133, 41, 460, 88, 108, 109, 110, 470, 66, 7, 136, 250, 83, 109
    ];
    const a2Ids = [
        114, 151, 22, 57, 593, 94, 196, 21, 31, 39, 59, 60, 61, 102, 50, 102, 50
    ];
    const a3Ids = [
        459, 155, 157, 158, 204, 258, 259, 260, 31, 37, 383, 384, 385, 386, 387, 388, 477, 65, 37, 102, 383, 477, 65, 68, 112, 20, 20, 459, 473, 608, 614, 97, 461, 68, 464, 467
    ];
    const a4Ids = [
    ];
    const a5Ids = [
        126, 231, 23, 64, 76, 78, 79, 19, 474, 1, 104, 127, 13, 17, 39, 45, 51, 59, 60, 76, 77, 87, 127, 87
    ];
    const a6Ids = [
        21, 59, 214, 215, 463, 54, 7
    ];
    const a7Ids = [
        209, 588, 591, 592, 63, 85
    ];
    const a8Ids = [];
    const a9Ids = [];
    const a10Ids = [];

    const ids = []
        .concat(a1Ids, a2Ids, a3Ids, a4Ids, a5Ids, a6Ids, a7Ids, a8Ids, a9Ids, a10Ids)
        .filter(utilities.uniqueFilter)
        .map((e) => e.toString());

    byCapecIds(objects, ids);
};

module.exports = {
    filterByActiveFilters
};

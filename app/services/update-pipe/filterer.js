const fileHandler = require('../file-handler');

function filterByActiveFilters(objects, activeFilters) {
    // Set filtered objects to all objects initially
    objects.capecObjectsFiltered = objects.capecObjects;
    objects.cweObjectsFiltered = objects.cweObjects;

    for (let filter of activeFilters) {
        switch (filter.toLowerCase()) {
        case 'deprecated':
            byDeprecated(objects);
            break;
        case 'owasp':
            byOwaspTop10(objects);
            break;
        default:
            console.log('No filter was found for active filter:', filter);
            break;
        }
    }
}

function byDeprecated(objects) {
    const capecAttackPatternObjectsFiltered = objects.capecObjectsFiltered['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern']
        .filter((e) => {
            return e['_attributes']['Status'].toLowerCase() !== 'deprecated';
        });
    objects.capecObjectsFiltered['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern'] = capecAttackPatternObjectsFiltered;

    const cweWeaknessObjectsFiltered = objects.cweObjectsFiltered['Weakness_Catalog']['Weaknesses']['Weakness']
        .filter((e) => {
            return e['_attributes']['Status'].toLowerCase() !== 'deprecated';
        });
    objects.cweObjectsFiltered['Weakness_Catalog']['Weaknesses']['Weakness'] = cweWeaknessObjectsFiltered;
}

function byOwaspTop10(objects) {
    // Extract all direct members (classes, bases, and variants) of OWASP Top 10 categories listed in OWASP Top 10 view
    const cweView = objects.cweObjectsFiltered['Weakness_Catalog']['Views']['View']
        .filter((e) => {
            return e['_attributes']['ID'] === '928';
        })[0];

    const cweCategoryIds = cweView['Members']['Has_Member']
        .map((e) => {
            return e['_attributes']['CWE_ID'];
        });
    const cweCategories = objects.cweObjectsFiltered['Weakness_Catalog']['Categories']['Category']
        .filter((e) => {
            return cweCategoryIds.includes(e['_attributes']['ID']);
        });

    const cweMemberIdsByCategory = {};
    cweCategories
        .forEach((c) => {
            if (!c['Relationships']) {
                return;
            }

            if (!(cweMemberIdsByCategory[c['_attributes']['ID']] instanceof Array)) {
                cweMemberIdsByCategory[c['_attributes']['ID']] = [];
            }

            const members = c['Relationships']['Has_Member'];
            if (members instanceof Array) {
                members
                    .forEach((e) => {
                        cweMemberIdsByCategory[c['_attributes']['ID']].push(e['_attributes']['CWE_ID']);
                    });
            } else {
                cweMemberIdsByCategory[c['_attributes']['ID']].push(members['_attributes']['CWE_ID']);
            }
        });
    const cweObjectsFiltered = objects.cweObjectsFiltered['Weakness_Catalog']['Weaknesses']['Weakness']
        .filter((e) => {
            for (let categoryId in cweMemberIdsByCategory) {
                if (cweMemberIdsByCategory[categoryId].includes(e['_attributes']['ID'])) {
                    return true;
                }
            }

            return false;
        });

    objects.cweObjectsFiltered = cweObjectsFiltered;

    // Extract all attack patterns related to OWASP Top 10 weaknesses
    const capecRelatedObjectIdsByWeakness = {};
    objects.cweObjectsFiltered.forEach((c) => {
        if (!c['Related_Attack_Patterns']) {
            return;
        }

        let weaknessId = c['_attributes']['ID'];
        capecRelatedObjectIdsByWeakness[weaknessId] = [];

        const members = c['Related_Attack_Patterns']['Related_Attack_Pattern'];
        if (members instanceof Array) {
            members
                .forEach((e) => {
                    capecRelatedObjectIdsByWeakness[weaknessId].push(e['_attributes']['CAPEC_ID']);
                });
        } else {
            capecRelatedObjectIdsByWeakness[weaknessId].push(members['_attributes']['CAPEC_ID']);
        }
    });
    const capecObjectsFiltered = objects.capecObjectsFiltered['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern']
        .filter((e) => {
            for (let weaknessId in capecRelatedObjectIdsByWeakness) {
                if (capecRelatedObjectIdsByWeakness[weaknessId].includes(e['_attributes']['ID'])) {
                    return true;
                }
            }

            return false;
        });

    objects.capecObjectsFiltered = capecObjectsFiltered;

    if (process.env.NODE_ENV === 'development') {
        writeTestOutputToFile(capecObjectsFiltered);
    }
}

function writeTestOutputToFile(data) {
    console.log('DEBUG Writing...');
    fileHandler.setFileContent('filterTest.json', JSON.stringify(data, null, 4));
    console.log('DEBUG Written.');
}

module.exports = {
    filterByActiveFilters
};

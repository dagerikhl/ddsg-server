const fileHandler = require('../file-handler');

function filterByActiveFilters(objects, activeFilters) {
    // Set filtered objects to all objects if no filter is active
    if (!activeFilters || activeFilters.length === 0) {
        objects.capecObjectsFiltered = objects.capecObjects;
        objects.cweObjectsFiltered = objects.cweObjects;
        return;
    }

    for (let filter of activeFilters) {
        switch (filter.toLowerCase()) {
        case 'owasp':
            byOwaspTop10(objects);
            break;
        default:
            console.log('No filter was found for active filter:', filter);
            break;
        }
    }
}

function byOwaspTop10(objects) {
    // Extract all direct members (classes, bases, and variants) of OWASP Top 10 categories listed in OWASP Top 10 view
    const cweView = objects.cweObjects['Weakness_Catalog']['Views']['View']
        .filter((e) => {
            return e['_attributes']['ID'] === '928';
        })[0];

    const cweCategoryIds = cweView['Members']['Has_Member']
        .map((e) => {
            return e['_attributes']['CWE_ID'];
        });
    const cweCategories = objects.cweObjects['Weakness_Catalog']['Categories']['Category']
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
    const cweObjectsFiltered = objects.cweObjects['Weakness_Catalog']['Weaknesses']['Weakness']
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
    const capecObjectsFiltered = objects.capecObjects['capec:Attack_Pattern_Catalog']['capec:Attack_Patterns']['capec:Attack_Pattern']
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

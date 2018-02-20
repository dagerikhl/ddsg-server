const fileHandler = require('../file-handler');

function filterByActiveFilters(objects, activeFilters) {
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
    const view = objects.cweObjects['Weakness_Catalog']['Views']['View']
        .filter((e) => {
            return e['_attributes']['ID'] === '928';
        })[0];

    const categoryIds = view['Members']['Has_Member']
        .map((e) => {
            return e['_attributes']['CWE_ID'];
        });
    const categories = objects.cweObjects['Weakness_Catalog']['Categories']['Category']
        .filter((e) => {
            return categoryIds.includes(e['_attributes']['ID']);
        });

    const memberIdsByCategory = {};
    categories
        .forEach((c) => {
            if (!c['Relationships']) {
                return;
            }

            if (!(memberIdsByCategory[c['_attributes']['ID']] instanceof Array)) {
                memberIdsByCategory[c['_attributes']['ID']] = [];
            }

            const members = c['Relationships']['Has_Member'];
            if (members instanceof Array) {
                members
                    .map((e) => {
                        memberIdsByCategory[c['_attributes']['ID']].push(e['_attributes']['CWE_ID']);
                    });
            } else {
                memberIdsByCategory[c['_attributes']['ID']].push(members['_attributes']['CWE_ID']);
            }
        });
    const categoryMembers = objects.cweObjects['Weakness_Catalog']['Weaknesses']['Weakness']
        .filter((e) => {
            for (let categoryId in memberIdsByCategory) {
                if (memberIdsByCategory[categoryId].includes(e['_attributes']['ID'])) {
                    return true;
                }
            }

            return false;
        });

    objects.cweObjectsFiltered = categoryMembers;

    // Extract all attack patterns related to OWASP Top 10 weaknesses

    // DEBUG
    writeTempJson(categoryMembers);
}

// DEBUG
function writeTempJson(v) {
    console.log('// DEBUG Writing...');
    fileHandler.setFileContent('test.json', JSON.stringify(v, null, 4));
    console.log('// DEBUG Written.');
}

module.exports = {
    filterByActiveFilters
};

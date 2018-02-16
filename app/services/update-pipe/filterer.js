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
    const owaspView = objects.cweObjects['Weakness_Catalog']['Views']['View']
        .filter((e) => {
            return e['_attributes']['ID'] === '928';
        })[0];

    const owaspCategoryIds = owaspView['Members']['Has_Member']
        .map((e) => {
            return e['_attributes']['CWE_ID'];
        });
    const owaspCategories = objects.cweObjects['Weakness_Catalog']['Categories']['Category']
        .filter((e) => {
            return owaspCategoryIds.includes(e['_attributes']['ID']);
        });

    const owaspCategoryMemberIds = [];
    owaspCategories.forEach((c) => {
        if (!c['Relationships']) {
            return;
        }

        const members = c['Relationships']['Has_Member'];
        if (members instanceof Array) {
            c['Relationships']['Has_Member']
                .map((e) => {
                    owaspCategoryMemberIds.push(e['_attributes']['CWE_ID']);
                });
        } else {
            owaspCategoryMemberIds.push(c['Relationships']['Has_Member']['_attributes']['CWE_ID']);
        }
    });
    const owaspCategoryMembers = objects.cweObjects['Weakness_Catalog']['Weaknesses']['Weakness']
        .filter((e) => {
            return owaspCategoryMemberIds.includes(e['_attributes']['ID']);
        });

    // Filter all weaknesses on owasp
    objects.cweObjectsFiltered = owaspCategoryMembers;

    // TODO Filter all attack patterns on relationships with the filtered weaknesses

    // DEBUG
    writeTempJson(owaspCategoryMembers);
}

// DEBUG
function writeTempJson(v) {
    fileHandler.setFileContent('test.json', JSON.stringify(v, null, 4));
}

module.exports = {
    filterByActiveFilters
};

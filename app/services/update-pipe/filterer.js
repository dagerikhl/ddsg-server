function filter(objects, activeFilters) {
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
    // FIXME
    objects.capecObjectsFiltered = objects.capecObjects;
    objects.cweObjectsFiltered = objects.cweObjects;
}

module.exports = {
    filter
};

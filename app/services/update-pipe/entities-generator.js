// TODO Parse fetched data and return all newly created entities
function generateStixEntities(objects, cb) {
    cb({
        cwe: objects.cweObjectsFiltered,
        capec: objects.capecObjectsFiltered
    });
}

module.exports = {
    generateStixEntities
};

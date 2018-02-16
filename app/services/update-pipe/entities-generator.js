// TODO Parse fetched data and return all newly created entities
function generateEntities(capecData, cweData, cb) {
    cb({
        capecData,
        cweData
    });
}

module.exports = {
    generateEntities
};

const stixGeneralGen = require('./general-generator');

let mitigationObject = null;

function feed(feedObject) {
    mitigationObject = feedObject;
}

function clear() {
    mitigationObject = null;
}

function genMitigationText() {
    return stixGeneralGen.buildRecursiveCapecMitigationText([], mitigationObject);
}

function genExternalReferences(id) {
    return [{
        source_name: 'capec',
        id: `CAPEC-${id}`
    }];
}

module.exports = {
    feed,
    clear,
    genMitigationText,
    genExternalReferences
};

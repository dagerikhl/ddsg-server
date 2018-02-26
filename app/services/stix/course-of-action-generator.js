const stixGeneralGen = require('./general-generator');

// Local state
let mitigationObject = null;

function feed(feedObject) {
    mitigationObject = feedObject;
}

function clear() {
    mitigationObject = null;
}

function genMitigationText() {
    return stixGeneralGen.buildRecursiveText([], mitigationObject);
}

module.exports = {
    feed,
    clear,
    genMitigationText
};

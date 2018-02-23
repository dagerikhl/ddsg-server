const stixGeneralGen = require('./general-generator');

let cweObject = null;

function feed(feedObject) {
    cweObject = feedObject;
}

function clear() {
    cweObject = null;
}

function genDescription() {
    return stixGeneralGen.buildRecursiveCapecMitigationText([], cweObject);
}

module.exports = {
    feed,
    clear
};

const stixGeneralGen = require('./general-generator');

// Local state
let assetObject = null;

function feed(feedObject) {
    assetObject = feedObject;
}

function clear() {
    assetObject = null;
}

function genAssetText() {
    const text = stixGeneralGen.buildRecursiveText(assetObject);
    if (text && text.length > 0) {
        return text;
    }

    return null;
}

module.exports = {
    feed,
    clear,
    genAssetText
};

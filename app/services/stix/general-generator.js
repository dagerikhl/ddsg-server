const utilities = require('../utilities');

function createEntity(type) {
    const uuid = utilities.uuid();
    const timestamp = utilities.timestamp();

    return {
        type: `${type}`,
        id: `${type}--${uuid}`,
        created: timestamp,
        modified: timestamp
    };
}

// TODO Due to CAPEC's complex description structure, this is not 100 % robust, and may not preserve order properly
function buildRecursiveCapecDescription(description, element) {
    if (typeof element === 'string') {
        return element;
    } else if (element['_text']) {
        return description.concat(buildRecursiveCapecDescription(description, element['_text']));
    } else if (element['capec:Text'] instanceof Array) {
        return description.concat(...element['capec:Text'].map((c) => {
            return description.concat(buildRecursiveCapecDescription(description, c));
        }));
    } else if (element['capec:Text']) {
        return description.concat(buildRecursiveCapecDescription(description, element['capec:Text']));
    } else if (element['capec:Code'] instanceof Array) {
        return description.concat(...element['capec:Code'].map((c) => {
            return description.concat(buildRecursiveCapecDescription(description, c));
        }));
    } else if (element['capec:Code']) {
        return description.concat(buildRecursiveCapecDescription(description, element['capec:Code']));
    } else if (element['capec:Block'] && Object.keys(element['capec:Block']).length > 1) {
        return description.concat(...Object.keys(element['capec:Block']).map((c) => {
            return description.concat(buildRecursiveCapecDescription(description, { [c]: element['capec:Block'][c] }));
        }));
    } else if (element['capec:Block']) {
        return description.concat(buildRecursiveCapecDescription(description, element['capec:Block']));
    } else if (element['capec:Summary'] && Object.keys(element['capec:Summary']).length > 1) {
        return description.concat(...Object.keys(element['capec:Summary']).map((c) => {
            return description.concat(buildRecursiveCapecDescription(description, { [c]: element['capec:Summary'][c] }));
        }));
    } else if (element['capec:Summary']) {
        return description.concat(buildRecursiveCapecDescription(description, element['capec:Summary']));
    }

    return description;
}

// TODO Due to CAPEC's complex description structure, this is not 100 % robust, and may not preserve order properly
function buildRecursiveCapecMitigationText(text, element) {
    if (typeof element === 'string') {
        return element;
    } else if (element['_text']) {
        return text.concat(buildRecursiveCapecMitigationText(text, element['_text']));
    } else if (element['capec:Text'] instanceof Array) {
        return text.concat(...element['capec:Text'].map((c) => {
            return text.concat(buildRecursiveCapecMitigationText(text, c));
        }));
    } else if (element['capec:Text']) {
        return text.concat(buildRecursiveCapecMitigationText(text, element['capec:Text']));
    } else if (element['capec:Solution_or_Mitigation'] instanceof Array) {
        return text.concat(...element['capec:Solution_or_Mitigation'].map((c) => {
            return text.concat(buildRecursiveCapecMitigationText(text, c));
        }));
    } else if (element['capec:Solution_or_Mitigation']) {
        return text.concat(buildRecursiveCapecMitigationText(text, element['capec:Solution_or_Mitigation']));
    }

    return text;
}

module.exports = {
    createEntity,
    buildRecursiveCapecDescription,
    buildRecursiveCapecMitigationText
};

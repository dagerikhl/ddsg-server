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

function genMitreExternalReferences(source, id) {
    return [
        {
            source_name: `${source.toLowerCase()}`,
            id: `${source.toUpperCase()}-${id}`,
            url: `https://${source}.mitre.org/data/definitions/${id}.html`
        }
    ];
}

// Due to CAPEC and CWE's complex text structure, this is not 100 % robust, and may not preserve order or lists properly
function buildRecursiveText(text, element) {
    if (typeof element === 'string') {
        return element;
    } else if (element instanceof Array) {
        return text.concat(...element
            .map((c) => {
                return text.concat(buildRecursiveText(text, c));
            }));
    } else if (element && typeof element === 'object') {
        return text.concat(...Object.keys(element)
            .filter((c) => {
                return c !== '_attributes';
            })
            .map((c) => {
                return text.concat(buildRecursiveText(text, element[c]));
            }));
    }

    return text;
}

module.exports = {
    createEntity,
    genMitreExternalReferences,
    buildRecursiveText
};

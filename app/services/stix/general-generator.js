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

/*
 * TODO This may need to be reworked to preserve ordering of elements in text structures
 *
 * This is difficult to do due to CAPEC and CWE's complex text structure. It is not 100 % robust, and may not preserve
 * order of elements, meaning placement of codeblocks or lists, properly. This is due to CAPEC and CWE using a form of
 * breadth-first expansion of the nodes. But they do not use a trivial implementation.
 */
function buildRecursiveText(textArray, element) {
    if (typeof element === 'string') {
        return element;
    } else if (element instanceof Array) {
        return textArray.concat(...element
            .map((c) => {
                return textArray.concat(buildRecursiveText(textArray, c));
            }));
    } else if (element && typeof element === 'object') {
        return textArray.concat(...Object.keys(element)
            .filter((c) => {
                return c !== '_attributes';
            })
            .map((c) => {
                return textArray.concat(buildRecursiveText(textArray, element[c]));
            }));
    }

    return textArray.length === 0 ? null : textArray;
}

module.exports = {
    createEntity,
    genMitreExternalReferences,
    buildRecursiveText
};

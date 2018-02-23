/**
 * Due to CAPEC's complex description structure, this is not 100 % robust, and may not preserve order as it should.
 *
 * @param description The description array to be populated.
 * @param element The element to be recursively parsed for data.
 * @returns {Array | string} The description array populated with all recursively parsed members.
 */
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

module.exports = {
    buildRecursiveCapecDescription
};

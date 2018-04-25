const uuidv4 = require('uuid/v4');

function timestamp() {
    return `${new Date().toISOString()}`;
}

function uuid() {
    return uuidv4();
}

function uniqueFilter(element, index, list) {
    return list.indexOf(element) === index;
}

module.exports = {
    timestamp,
    uuid,
    uniqueFilter
};

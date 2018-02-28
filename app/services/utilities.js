const uuidv4 = require('uuid/v4');

function timestamp() {
    return `${new Date().toISOString()}`;
}

function uuid() {
    return uuidv4();
}

module.exports = {
    timestamp,
    uuid
};

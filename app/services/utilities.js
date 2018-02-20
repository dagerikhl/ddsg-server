const uuidv4 = require('uuid/v4');

function timestamp() {
    return `${new Date(Date.now() || new Date().getTime()).toISOString()}`;
}

function uuid() {
    return uuidv4();
}

module.exports = {
    timestamp,
    uuid
};

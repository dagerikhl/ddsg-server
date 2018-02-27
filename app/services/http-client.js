const axios = require('axios');

function get(url, cb) {
    axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(err => {
            logger.error(err);
        });
}

function getBinary(url, cb) {
    axios.get(url, { responseType: 'arraybuffer' })
        .then(res => {
            cb(res.data);
        })
        .catch(err => {
            logger.error(err);
        });
}

module.exports = {
    get,
    getBinary
};

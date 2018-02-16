const axios = require('axios');

function get(url, cb) {
    axios.get(url)
        .then(response => {
            cb(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

function getBinary(url, cb) {
    axios.get(url, { responseType: 'arraybuffer' })
        .then(response => {
            cb(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = {
    get,
    getBinary
};

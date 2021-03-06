const axios = require('axios');

function get(url, cb) {
    return axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(err => {
            logger.error(err);
            console.log(err);
        });
}

module.exports = {
    get
};

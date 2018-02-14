// TODO Make sure the data is actually set before return, suspect async/promise/cb errors
function fetchCapecData(version) {
    let data = {};
    httpGet(`https://capec.mitre.org/data/xml/capec_v${version}.xml`, (res) => {
        // TODO Ensure correctness of data
        data = res;
    });

    if (data === null) {
        throw 'Could not get CAPEC data.';
    }

    return data;
}

function fetchCweData(version) {
    let data = {};
    httpGet(`https://cwe.mitre.org/data/xml/cwec_v${version}.xml.zip`, (res) => {
        // TODO Process ZIP
        let unzipped = res;
        // TODO Ensure correctness of data
        data = unzipped;
    });

    if (data === null) {
        throw 'Could not get CWE data.';
    }

    return data;
}

module.exports = {
    fetchCapecData,
    fetchCweData
};

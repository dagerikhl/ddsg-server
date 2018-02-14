// TODO Make sure the data is actually set before return, suspect async/promise/cb errors
function fetchCapecData() {
    let data = {};
    httpGet(`https://capec.mitre.org/data/xml/capec_v${version}.xml`, (res) => {
        // TODO Ensure correctness of data
        data = res;
    });

    return data;
}

function fetchCweData() {
    let data = {};
    httpGet(`https://cwe.mitre.org/data/xml/cwec_v${version}.xml.zip`, (res) => {
        // TODO Process ZIP
        let unzipped = res;
        // TODO Ensure correctness of data
        data = unzipped;
    });

    return data;
}

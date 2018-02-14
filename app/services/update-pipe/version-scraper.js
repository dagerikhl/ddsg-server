function getNewestVersionOfSource(source) {
    let version = null;
    switch (source.toLowerCase()) {
    case 'capec':
        // TODO Scrape website for version nr.
        version = '2.11';
        break;
    case 'cwe':
        // TODO Scrape website for version nr.
        version = '3.0';
        break;
    default:
        throw `Data source does not exist: ${source}`;
    }

    if (version === null) {
        throw `Could not scrape ${source.toUpperCase()} newest version.`;
    }

    return version;
}

module.exports = {
    getNewestVersionOfSource
};

export class WebsiteScraper {

    // TODO Scrape all sources for version number; make as robust as possible
    public getVersion(source) {
        switch (source.toLowerCase()) {
        case 'capec':
            // TODO Scrape website for version nr.
            return '2.11';
        case 'cwe':
            // TODO Scrape website for version nr.
            return '2.11';
        default:
            throw `Data source does not exist: ${source}`;
        }
    }

}

import { HttpClient } from '../http-client';
import { WebsiteScraper } from './website-scraper';

export class DataFetcher {

    private client = new HttpClient();
    private scraper = new WebsiteScraper();

    public fetchAllData() {
        const data = [];
        data.push(this.fetchCapecData());
        data.push(this.fetchCweData());
        // Add additional sources if relevant

        return data;
    }

    private fetchCapecData() {
        const version = this.scraper.getVersion('capec');

        let data = {};
        this.client.get(`https://capec.mitre.org/data/xml/capec_v${version}.xml`, (res) => {
            // TODO Ensure correctness of data
            data = res;
        });

        return data;
    };

    private fetchCweData() {
        const version = this.scraper.getVersion('cwe');

        let data = {};
        this.client.get(`https://cwe.mitre.org/data/xml/cwec_v${version}.xml.zip`, (res) => {
            // TODO Process ZIP
            let unzipped = res;
            // TODO Ensure correctness of data
            data = unzipped;
        });

        return data;
    };

}

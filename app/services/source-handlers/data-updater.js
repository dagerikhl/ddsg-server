import { FileHandler } from '../file-handler';
import { DataFetcher } from './data-fetcher';
import { DataParser } from './data-parser';

// TODO Use from server.js at intervals (how often do I expect sources to update?)
export class DataUpdater {

    private fetcher = new DataFetcher();
    private parser = new DataParser();
    private fileHandler = new FileHandler();

    // TODO Call from server.js
    public updateData() {
        const data = this.fetcher.fetchAllData();
        const entities = this.parser.parseData(data);

        let newContent = {
            timestamp: Date.now() || new Date().getTime(),
            entities: entities
        };

        this.fileHandler.setFileContent('entities', newContent);
    }

}

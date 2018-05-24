const sinon = require('sinon');
const chai = require('chai');

chai.should();
const expect = chai.expect;

describe('The update pipe module', function () {
    describe('#fetchUpdatedDataFromSources()', function () {
        let updatePipe;

        before(function () {
            process.env.USE_FILE_SYSTEM = 'false';
            process.env.LOCAL_JSON_STORE = 'false';
        });

        beforeEach(function () {
            updatePipe = require('./update-pipe');
        });

        it('should not have any entities in a global variabled before fetching and filtering', function () {
            expect(entities).to.satisfy((data) => !data || Object.keys(data).length === 0);
        });

        /**
         * This is really an integration test, but is included to ensure sources are fetched correctly before deploy.
         */
        it('should store entities into global variable after fetching and filtering them', function (done) {
            updatePipe.fetchUpdatedDataFromSources()
                .then(() => {
                    expect(entities).to.satisfy((data) => data !== null && Object.keys(data).length > 0);
                })
                .then(done, done);
        }).timeout(60000);
    });
});

const sinon = require('sinon');
const chai = require('chai');

chai.should();
const expect = chai.expect;

describe('The update pipe module', function () {
    describe('#fetchUpdatedDataFromSources()', function () {
        let updatePipe;

        beforeEach(function () {
            updatePipe = require('./update-pipe');
        });

        describe('With file system', function () {
            let setFileContentSpy;

            const fileHandler = require('../file-handler');

            before(function () {
                process.env.USE_FILE_SYSTEM = 'true';
                process.env.LOCAL_JSON_STORE = 'true';

                sinon.stub(fileHandler, 'getFileContent').returns('{}');
                setFileContentSpy = sinon.spy(fileHandler, 'setFileContent');
            });

            after(function () {
                fileHandler.getFileContent.restore();
                fileHandler.setFileContent.restore();
            });

            /**
             * This is really an integration test, it's included to ensure sources are fetched correctly before deploy.
             */
            it('should store entities to file after fetching and filtering them', function (done) {
                updatePipe.fetchUpdatedDataFromSources()
                    .then(() => {
                        setFileContentSpy.calledWith('entities.json').should.be.true;
                    })
                    .then(done, done);
            }).timeout(60000);
        });

        describe('Without file system', function () {
            before(function () {
                process.env.USE_FILE_SYSTEM = 'false';
                process.env.LOCAL_JSON_STORE = 'false';
            });

            it('should not have any entities in a global variabled before fetching and filtering', function () {
                expect(entities).to.satisfy((data) => !data || Object.keys(data).length === 0);
            });

            /**
             * This is really an integration test, it's included to ensure sources are fetched correctly before deploy.
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
});

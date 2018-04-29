const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The file handler module', function () {
    let fileHandler;

    let content;
    let contentString;
    let fileName;
    let correctPath;

    const fs = require('fs');
    const path = require('path');
    const basePath = 'data';

    before(function () {
        fileHandler = require('./file-handler');

        content = {
            test: 'test content'
        };
        contentString = JSON.stringify(content);
        fileName = 'test.json';
        correctPath = path.join(basePath, fileName);
    });

    describe('#getFileContent()', function () {
        let readFileStub;

        let fileContent;

        beforeEach(function () {
            readFileStub = sinon.stub(fs, 'readFileSync').returns(contentString);

            fileContent = fileHandler.getFileContent(fileName);
        });

        afterEach(function () {
            fs.readFileSync.restore();
        });

        it('should read from the correct file based on base path and file name', function () {
            readFileStub.lastCall.args[0].should.be.eq(correctPath);
        });

        it('should return contents of file as a string', function () {
            fileContent.should.be.a('string');
        });

        it('should return the correct content from the file', function () {
            fileContent.should.be.eq(contentString);
        });
    });

    describe('#setFileContent()', function () {
        let writeFileSpy;

        beforeEach(function () {
            writeFileSpy = sinon.spy(fs, 'writeFileSync');

            fileHandler.setFileContent(fileName, contentString);
        });

        afterEach(function () {
            fs.writeFileSync.restore();
        });

        it('should write to the correct file based on base path and file name', function () {
            writeFileSpy.lastCall.args[0].should.be.eq(correctPath);
        });

        it('should set the correct contents of the target file', function () {
            writeFileSpy.lastCall.args[1].should.be.eq(contentString);
        });
    });

    describe('#removeFile()', function () {
        let existsStub;
        let unlinkSpy;

        beforeEach(function () {
            existsStub = sinon.stub(fs, 'existsSync');
            unlinkSpy = sinon.spy(fs, 'unlink');
        });

        afterEach(function () {
            fs.existsSync.restore();
            fs.unlink.restore();
        });

        it('should test that the file exists', function () {
            fileHandler.removeFile(fileName);

            existsStub.called.should.be.true;
        });

        it('should test that the file exists before trying to remove the file', function () {
            existsStub.returns(true);

            fileHandler.removeFile(fileName);

            existsStub.lastCall.calledBefore(unlinkSpy.lastCall).should.be.true;
        });

        it('should not unlink the file if it does not exist', function () {
            existsStub.returns(false);

            fileHandler.removeFile(fileName);

            unlinkSpy.callCount.should.be.eq(0);
        });

        it('should remove the correct file based on base path and file name', function () {
            existsStub.returns(true);

            fileHandler.removeFile(fileName);

            unlinkSpy.lastCall.args[0].should.be.eq(correctPath);
        });

        it('should log an error if the file does not exist', function () {
            existsStub.returns(true);

            fileHandler.removeFile('unknown file');

            unlinkSpy.callArgOnWith(1, {}, 'an error');

            logger.error.callCount.should.be.equal(1);
        });
    });
});

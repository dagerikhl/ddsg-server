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

        before(function () {
            readFileStub = sinon.stub(fs, 'readFileSync').returns(contentString);
        });

        after(function () {
            fs.readFileSync.restore();
        });

        beforeEach(function () {
            fileContent = fileHandler.getFileContent(fileName);
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

        before(function () {
            writeFileSpy = sinon.spy(fs, 'writeFileSync');
        });

        after(function () {
            fs.writeFileSync.restore();
        });

        beforeEach(function () {
            fileHandler.setFileContent(fileName, contentString);
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
        let unlinkStub;

        before(function () {
            existsStub = sinon.stub(fs, 'existsSync').returns(true);
            unlinkStub = sinon.stub(fs, 'unlink');
        });

        after(function () {
            fs.existsSync.restore();
            fs.unlink.restore();
        });

        beforeEach(function () {
            fileHandler.removeFile(fileName);
        });

        it('should test that the file exists', function () {
            existsStub.called.should.be.true;
        });

        it('should test that the file exists before trying to remove the file', function () {
            existsStub.lastCall.calledBefore(unlinkStub.lastCall).should.be.true;
        });

        it('should remove the correct file based on base path and file name', function () {
            unlinkStub.lastCall.args[0].should.be.eq(correctPath);
        });
    });

    describe('#extractEntryFromZipFile()', function () {
        let readStreamSpy;
        let writeStreamSpy;

        let zipFileName;
        let correctZipPath;
        let callbackSpy;

        before(function () {
            readStreamSpy = sinon.spy(fs, 'createReadStream');
            writeStreamSpy = sinon.spy(fs, 'createWriteStream');

            zipFileName = fileName.replace('.json', '.zip');
            correctZipPath = correctPath.replace('.json', '.zip');
            callbackSpy = sinon.spy();
        });

        after(function () {
            fs.createReadStream.restore();
            fs.createWriteStream.restore();
        });

        beforeEach(function () {
            fileHandler.extractEntryFromZipFile(zipFileName, fileName, callbackSpy);
        });

        it('should create a read stream to the correct zip file based on base path and file name', function () {
            readStreamSpy.lastCall.args[0].should.be.eq(correctZipPath);
        });
    });
});

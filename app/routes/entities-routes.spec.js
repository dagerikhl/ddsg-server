const sinon = require('sinon');
const chai = require('chai');

chai.should();

describe('The entities routes function module', function () {
    let app;
    let req;
    let res;

    before(function () {
        global.entities = {};

        app = { get: null };

        req = {
            method: null,
            headers: {
                host: null
            },
            url: null
        };
        res = { json: null };
    });

    beforeEach(function () {
        app.get = sinon.spy();
        res.json = sinon.spy();

        require('./entities-routes')(app);
    });

    describe('With file system', function () {
        const fileHandler = require('../services/file-handler');

        before(function () {
            process.env.USE_FILE_SYSTEM = 'true';

            sinon.stub(fileHandler, 'getFileContent').returns('{}');
            sinon.stub(fileHandler, 'setFileContent');
        });

        after(function () {
            fileHandler.getFileContent.restore();
            fileHandler.setFileContent.restore();
        });

        it('should export exactly one route', function () {
            app.get.calledOnce.should.be.true;
        });

        it('should export the /entities route', function () {
            app.get.calledWith('/entities').should.be.true;
        });

        it('should log a serving statement when requested', function () {
            app.get.callArgWith(1, req, res);

            logger.info.calledWithMatch(/Serving.*/).should.be.true;
        });

        it('should serve JSON response when requested', function () {
            const emptyResponseString = '{}';
            const emptyResponseObject = JSON.parse(emptyResponseString);

            app.get.callArgWith(1, req, res);

            res.json.lastCall.args[0].should.be.eql(emptyResponseObject);
        });
    });

    describe('Without file system', function () {
        before(function () {
            process.env.USE_FILE_SYSTEM = 'false';
        });

        it('should export exactly one route', function () {
            app.get.calledOnce.should.be.true;
        });

        it('should export the /entities route', function () {
            app.get.calledWith('/entities').should.be.true;
        });

        it('should log a serving statement when requested', function () {
            app.get.callArgWith(1, req, res);

            logger.info.calledWithMatch(/Serving.*/).should.be.true;
        });

        it('should serve JSON response when requested', function () {
            const emptyResponseString = '{}';
            const emptyResponseObject = JSON.parse(emptyResponseString);

            app.get.callArgWith(1, req, res);

            res.json.lastCall.args[0].should.be.eql(emptyResponseObject);
        });
    });

});
